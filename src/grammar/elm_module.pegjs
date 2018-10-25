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

__ "ignored"
  = (Ws / Comment)*

Ws
  = [ \r\n\t]

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

ExposingAllToken
  = ".."

AsToken
  = "as" Ws __

PortToken
  = "port" Ws __

ModuleToken
  = "module" Ws __

ExposingToken
  = "exposing" Ws __

ImportToken
  = "import" Ws __

TypeAliasToken
  = "type alias " Ws __

TypeToken
  = "type alias " Ws __

SingleLineComment
  = "--" [^\n]* Ws*

MultiLineComment
  = "{-" (!"-}" ( MultiLineComment / . ))* "-}" Ws*

Comment
  = SingleLineComment
  / MultiLineComment

ModuleAlias = AsToken moduleName:ModuleName { return moduleName; }

ModuleDeclaration "module declaration"
  = port:PortToken?
    ModuleToken
    moduleName:ModulePath __
    exposing:ModuleExports? {
      return {
        location: location().start,
        type: port ? 'port-module' : 'module',
        name: moduleName,
        exposing: exposing,
      };
   }

ImportStatement "import statement"
  = ImportToken
    moduleName:ModulePath __
    alias:ModuleAlias? __
    exposing:ModuleExports? {
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
  / ctor:ConstructorExport  { return ctor; }
  / module:ModuleName { return { type: 'type', name: module }; }

ExposingList =
  head:ExportedModule
  tail:(Comma t:ExportedModule)* { return buildList(head, tail, 1); }

ModuleExports
  = ExposingToken
    LParen exposing:ExposingList RParen {
      return exposing;
    }

FunctionName
  = ([a-z][a-z0-9]i*)+ { return text().trim(); }
  / LParen [:+-]+ RParen { return text().trim(); }

ModulePath
  = head:ModuleName tail:("." ModuleName)* { return text().trim(); }

ModuleName
  = ([A-Z][a-z0-9]i*)+ Ws* { return text().trim(); }

Statement
  = ImportStatement
  / TypeAlias
  / CustomType
  / FunctionDeclaration

TypeAlias "type alias"
  = TypeAliasToken name:ModuleName Equals { return { type: 'type-alias', name: name, location: location().start, }; }

CustomType "custom type declaration"
  = TypeToken name:ModuleName Equals { return { type: 'custom-type', name: name, location: location().start, }; }

FunctionDeclaration = functionName:FunctionName Colon { return { type: 'function-definition', name: functionName, location: location().start, }; }

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
  = [^\n]*[\n]

SourceElement
  = Statement
  / AnyLine { return null; }