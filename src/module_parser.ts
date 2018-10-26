export type Parser<T> = {
   (input: string, options?: any): T
}

export interface Location {
   offset: number
   line: number
   column: number
}

export interface Locatable {
   location: Location
}

export type ExposedFunction = { type: 'function'; name: string }

export type ExposedType = { type: 'type'; name: string }

export type ExposedConstructor = { type: 'constructor'; name: string }

export type ExposedAll = { type: 'all' }

export type Exposed = ExposedAll | ExposedFunction | ExposedType | ExposedConstructor

export type FunctionDeclaration = { type: 'function-definition'; name: string } & Locatable

export type TypeAliasDeclaration = { type: 'type-alias'; name: string } & Locatable

export type CustomTypeDeclaration = {
   type: 'custom-type'
   constructors: ConstructorDeclaration[]
   name: string
} & Locatable

export type ConstructorDeclaration = { type: 'constructor'; name: string } & Locatable

export type TypeDeclaration = TypeAliasDeclaration | CustomTypeDeclaration
export interface ImportStatement {
   type: 'import'
   module: string
   alias: string
   exposing: Exposed[]
   location: Location
}

export interface Module {
   type: 'module' | 'port-module'
   name: string
   exposing: Exposed[]
   imports: ImportStatement[]
   functions: FunctionDeclaration[]
   types: TypeDeclaration[]
   location: Location
}

export const ModuleParser = loadParser<Module>('elm_module_parser')

function loadParser<T>(path: string): Parser<T> {
   const parse = require(`../parsers/${path}`).parse
   return (input: string, args: any) => parse(`${input}\n`, args)
}
