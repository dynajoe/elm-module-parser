Start
  = __ module:Module __ EOF {
    return {
      ...module,
      text: text(),
    };
  }

Ws "ws"
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

// Whitespace / Newline / Any Comment
__ "ws-eol-comment"
  = (Ws / LineTerminatorSequence / Comment)*

// Whitespace or {- comment -} without line terminator
_ "ws-inline-comment"
  = (Ws / MultiLineCommentNoLineTerminator)*

LParen = __ "(" __

RParen = __ ")" __

Equals
  = __ "=" __

Colon
  = __ ":" __

Comma
  = __ "," __

IdentifierPart
  = [a-z0-9_]i

OperatorPart
  = [+-/*=.<>:&|^?%!]

Operator
  = $ (OperatorPart+)

ModuleName
  = $ ([A-Z] IdentifierPart*)

Identifier
  = $ ([a-z] IdentifierPart*)

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

EOS
  = _ SingleLineComment? LineTerminatorSequence
  / _ &")"
  / __ EOF

MultiLineCommentNoLineTerminator
  = "{-" (!("{-" / LineTerminator) .)* "-}"

SingleLineComment "single-line-comment"
  = "--" [^\n]* Ws*

MultiLineComment "multi-line-comment"
  = "{-" (!"-}" ( MultiLineComment / . ))* "-}" Ws*

Comment "comment"
  = SingleLineComment
  / MultiLineComment

ModulePath
  = head:ModuleName tail:("." ModuleName)* { return text(); }

ConstructorExport
  = name:(n:ModuleName { return { name: n, location: location(), }; }) LParen ExposingAllToken RParen {
      return {
        ...name,
        type: 'constructor',
      };
    }

ExportedModule
  = fn:FunctionName { return { type: 'function', name: fn, location: location(), }; }
  / ctor:ConstructorExport { return ctor; }
  / module:ModuleName { return { type: 'type', name: module, location: location(), }; }

ExposingList =
  head:ExportedModule
  tail:(Comma m:ExportedModule { return m; })* {
    return [head].concat(tail);
  }

ModuleExports
  = ExposingToken __
    "(" __ exposing:(ExposingAllToken / ExposingList) __ ")" {
      return exposing;
    }

ModuleDeclaration "module declaration"
  = port:(PortToken _)?
    ModuleToken _
    name:(n:ModulePath { return { location: location(), name: n, }; })
    exposing:(__ e:ModuleExports { return e; } )? {
      return {
        ...name,
        type: port ? 'port-module' : 'module',
        exposing: exposing === 'all' || exposing == null ? [] : exposing,
        exposes_all: exposing === 'all',
      };
   }

Statement
  = ImportStatement
  / TypeAlias
  / CustomType
  / PortDeclaration
  / FunctionAnnotation
  / FunctionDeclaration

ModuleAlias "module alias"
  = AsToken __ moduleName:ModuleName { return moduleName; }

FunctionName "function-name"
  = Identifier { return text(); }
  / "(" _ name:OperatorPart _ ")" { return "(" + name + ")"; }

ImportStatement "import statement"
  = __ i:(ImportToken _
    moduleName:ModulePath
    alias:(__ a:ModuleAlias { return a; })?
    exposing:(__ e:ModuleExports { return e; })? {
      return {
        location: location(),
        type: 'import',
        module: moduleName,
        alias: alias,
        exposing: exposing === 'all' || exposing == null ? [] : exposing,
        exposes_all: exposing === 'all',
      };
    }) __ { return i; }

TopLevelStatementStart
  = LineTerminator (
      TypeToken
    / TypeAliasToken
    / ModuleToken
    / ImportToken
    / FunctionName
    / PortToken
  )

CustomTypeConstructor "custom type constructor"
  = name:(n:ModuleName { return { location: location(), name: n }; }) (!TopLevelStatementStart !"|" .)* {
    return {
      ...name,
      type: 'constructor',
    };
  }

ConstructorList "custom type constructors"
  = head:CustomTypeConstructor t:("|" __ c:CustomTypeConstructor { return c; })* { return [head].concat(t); }

TypeAlias "type alias"
  = LineTerminator* TypeAliasToken __ name:(n:ModuleName { return { location: location(), name: n }; }) __ Equals {
    return {
      ...name,
      type: 'type-alias',
    };
  }

TypeParameterList
  = head:([a-z]+) tail:(__ n:([a-z]+) { return n; }) {
    return [head].concat(tail);
  }

CustomType "custom type declaration"
    = LineTerminator* TypeToken __ name:(n:ModuleName { return { location: location(), name: n }; }) __ TypeParameterList? __ Equals __ constructors:ConstructorList EOS {
      return {
        ...name,
        constructors: constructors,
        type: 'custom-type',
      };
    }

PortDeclaration "port declaration"
  = LineTerminator* PortToken __ fn:FunctionAnnotation {
    return {
      ...fn,
      type: 'port-declaration'
    }
  }

FunctionParams
  = head:(Identifier / '_') tail:(_ name:(Identifier / '_') { return name; })* {
    return [head].concat(tail);
  }

FunctionAnnotation "function annotation"
  = LineTerminator* name:(n:FunctionName { return { name: n, location: location(), }; }) __ Colon {
    return {
      ...name,
      type: 'function-annotation',
    };
  }

FunctionDeclaration "function declaration"
  = LineTerminator* name:(n:FunctionName { return { name: n, location: location(), }; }) __ params:FunctionParams? __ Equals {
    return {
      ...name,
      type: 'function-declaration',
      parameters: params ? params : [],
    };
  }

Module
  = module:ModuleDeclaration
    statements:SourceElements? {
    return {
      ...module,
      imports: statements ? statements.filter(s => s.type === 'import') : [],
      types: statements ? statements.filter(s => s.type === 'custom-type' || s.type === 'type-alias') : [],
      function_annotations: statements ? statements.filter(s => s.type === 'function-annotation') : [],
      function_declarations: statements ? statements.filter(s => s.type === 'function-declaration') : [],
    };
  }

SourceElements
  = head:SourceElement tail:SourceElement* {
    return [head].concat(tail)
  }

EOF
  = !.

AnyLine "skipped"
  = [^\n]* '\n'

SourceElement
  = Statement
  / AnyLine