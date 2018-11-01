export type Parser<T> = {
   (input: string, options?: any): T
}

export interface Location {
   start: {
      offset: number
      line: number
      column: number
   }
   end: {
      offset: number
      line: number
      column: number
   }
}

export interface Locatable {
   location: Location
}

export type ExposedFunction = { type: 'function'; name: string } & Locatable

export type ExposedType = { type: 'type'; name: string } & Locatable

export type ExposedConstructor = { type: 'constructor'; name: string } & Locatable

export type Exposed = ExposedFunction | ExposedType | ExposedConstructor

export type FunctionDeclaration = { type: 'function-declaration'; name: string; parameters: string[] } & Locatable

export type FunctionAnnotation = { type: 'function-annotation'; name: string } & Locatable

export type TypeAliasDeclaration = { type: 'type-alias'; name: string } & Locatable

export type ConstructorDeclaration = { type: 'constructor'; name: string } & Locatable

export type CustomTypeDeclaration = {
   type: 'custom-type'
   constructors: ConstructorDeclaration[]
   name: string
} & Locatable

export type TypeDeclaration = TypeAliasDeclaration | CustomTypeDeclaration

export interface ImportStatement extends Locatable {
   type: 'import'
   module: string
   alias: string
   exposes_all: boolean
   exposing: Exposed[]
}

export interface Module {
   type: 'module' | 'port-module'
   name: string
   text: string
   exposes_all: boolean
   exposing: Exposed[]
   imports: ImportStatement[]
   types: TypeDeclaration[]
   function_declarations: FunctionDeclaration[]
   function_annotations: FunctionAnnotation[]
   location: Location
}

export const parseElmModule = loadParser<Module>('elm_module_parser')

function loadParser<T>(path: string): Parser<T> {
   const parse = require(`../parsers/${path}`).parse
   return (input: string, args: any) => {
      return { ...parse(`${input}\n`, args), text: input }
   }
}
