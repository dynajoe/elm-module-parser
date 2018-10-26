{
  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }

  function optionalList(value) {
    return value !== null ? value : [];
  }
}

Start
  = __ module:Module __
    EOF { return module; }

Ws "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

__ = (Ws / LineTerminatorSequence / Comment)*

_ = (Ws / MultiLineCommentNoLineTerminator)*

LParen = __ "(" __

RParen = __ ")" __

LBrace = __ "{" __

RBrace = __ "}" __

Equals
  = __ "=" __

Colon
  = __ ":" __

Comma
  = __ "," __

Pipe
  = __ "|" __

IdentifierPart
  = [a-z_]i

OperatorPart
  = $ [:+-]+

ExposingAllToken
  = ".."

AsToken
  = "as" !IdentifierPart

PortToken
  = "port" !IdentifierPart

ModuleToken
  = "module" !IdentifierPart

ExposingToken
  = "exposing" !IdentifierPart

ImportToken
  = "import" !IdentifierPart

TypeAliasToken
  = "type alias" !IdentifierPart

TypeToken
  = "type" !IdentifierPart

MultiLineCommentNoLineTerminator
  = "{-" (!("{-" / LineTerminator) .)* "-}"

// Automatic Semicolon Insertion

EOS
  = _ SingleLineComment? LineTerminatorSequence
  / _ &")"
  / __ EOF

SingleLineComment "comment"
  = "--" [^\n]* Ws*

MultiLineComment "comment"
  = "{-" (!"-}" ( MultiLineComment / . ))* "-}" Ws*

Comment
  = SingleLineComment
  / MultiLineComment

ModuleAlias = AsToken __ moduleName:ModuleName { return moduleName; }

ModuleDeclaration "module declaration"
  = port:(PortToken _)?
    ModuleToken _
    moduleName:ModulePath
    exposing:(__ e:ModuleExports { return e; } )? __ {
      return {
        location: location().start,
        type: port ? 'port-module' : 'module',
        name: moduleName,
        exposing: exposing,
      };
   }

ImportStatement "import statement"
  = ImportToken _
    moduleName:ModulePath
    alias:(__ a:ModuleAlias { return a; })?
    exposing:(__ e:ModuleExports { return e; })? __ {
      return {
        location: location().start,
        type: 'import',
        module: moduleName,
        alias: alias,
        exposing: exposing || [],
      };
    }

ConstructorExport
  = moduleName:ModuleName LParen ExposingAllToken RParen {
      return {
        type: 'constructor',
        name: moduleName,
      };
    }

ExportedModule
  = ExposingAllToken { return { type: 'all' }; }
  / fn:FunctionName { return { type: 'function', name: fn }; }
  / ctor:ConstructorExport { return ctor; }
  / module:ModuleName { return { type: 'type', name: module }; }

ExposingList =
  head:ExportedModule
  tail:(Comma ExportedModule)* { return buildList(head, tail, 1); }

ModuleExports
  = ExposingToken
    LParen exposing:ExposingList RParen {
      return exposing;
    }

FunctionName "function-name"
  = [a-z] IdentifierPart* { return text(); }
  / LParen name:OperatorPart RParen { return "(" + name + ")"; }

ModulePath
  = head:ModuleName tail:("." ModuleName)* { return text(); }

ModuleName
  = [A-Z] IdentifierPart* { return text(); }

Statement
  = ImportStatement
  / TypeAlias
  / CustomType
  / FunctionDeclaration

TopLevelStatementStart
  = LineTerminator (
      TypeToken
    / TypeAliasToken
    / ModuleToken
    / ImportToken
    / FunctionName
  )

ConstructorDelimeter = "|"

Constructor "union-type"
  = name:ModuleName (!TopLevelStatementStart !ConstructorDelimeter .)* { return { type: 'constructor', name: name, location: location().start, }; }

TypeList "type-list"
  = head:Constructor t:(ConstructorDelimeter __ c:Constructor { return c; })* { return [head].concat(t); }

TypeAlias "type alias"
  = LineTerminator* start:( TypeAliasToken { return location().start; } ) __ name:ModuleName Equals { return { type: 'type-alias', name: name, location: start, }; }

CustomType "custom type declaration"
    = LineTerminator* start:( TypeToken { return location().start; } ) __ name:ModuleName Equals constructors:TypeList EOS { return { constructors: constructors, type: 'custom-type', name: name, location: start, }; }

FunctionDeclaration "function annotation"
  = LineTerminator* fn:( functionName:FunctionName { return  { name: functionName, start: location().start }; } ) __ Colon { return { type: 'function-definition', name: fn.name, location: fn.start, }; }

Module
  = module:ModuleDeclaration
    statements:SourceElements? {
    return {
      ...module,
      imports: statements ? statements.filter(s => s.type === 'import') : [],
      types: statements ? statements.filter(s => s.type === 'custom-type' || s.type === 'type-alias') : [],
      functions: statements ? statements.filter(s => s.type === 'function-definition') : [],
    };
  }

SourceElements
  = head:SourceElement tail:SourceElement* {
    return [head].concat(tail).filter(x => x != null)
  }

EOF
  = !.

AnyLine "skipped"
  =  [^\n]* '\n'

SourceElement
  = Statement
  / AnyLine