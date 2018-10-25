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

start
  = __ program:Program __
    EOF { return program; }

__ "ignored"
  = (Ws / Comment)*

LParen = __ "(" __

RParen = __ ")" __

LBrace = __ "{" __

RBrace = __ "}" __

ModuleAlias = AsToken moduleName:ModuleName { return moduleName; }

ModuleDeclaration "module declaration"
  = ModuleToken
    moduleName:ModulePath
    exposing:ModuleExports? {
      return {
        location: location().start,
        type: 'module',
        module: moduleName,
        exposing: exposing,
      };
   }

ImportStatement "import statement"
  = ImportToken
    moduleName:ModulePath
    alias:ModuleAlias?
    exposing:ModuleExports? {
      return {
        location: location().start,
        type: 'import',
        module: moduleName,
        alias: alias,
        exposing: exposing,
      };
    }

ConstructorExport
  = moduleName:ModuleName LParen ExposingAll RParen {
      return {
        type: 'constructor',
        name: moduleName,
      };
    }

ExportedModule
  = ExposingAll { return { type: 'all' }; }
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

SingleLineComment
  = "--" [^\n]* Ws*

MultiLineComment
  = "{-" (!"-}" ( MultiLineComment / . ))* "-}" Ws*

Comment
  = SingleLineComment
  / MultiLineComment

Comma
  = Ws* "," Ws*

ExposingAll
  = ".."

Ws
  = [ \r\n\t]

FunctionName
  = ([a-z][a-z0-9]+)+ { return text().trim(); }
  / LParen [:+-]+ RParen { return text().trim(); }

ModulePath
  = head:ModuleName tail:("." ModuleName)* { return text().trim();}

ModuleName
  = ([A-Z][a-z0-9]i*)+ Ws* { return text().trim(); }

AsToken
  = "as" Ws+

ModuleToken
  = Ws* "module" Ws+

ExposingToken
  = "exposing" Ws+

ImportToken
  = "import" Ws+

Statement
  = ImportStatement

Program
  = module:ModuleDeclaration
    statements:SourceElements? {
    return {
      ...module,
      type: "Program",
      statements: statements
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