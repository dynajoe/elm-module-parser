type Parser<T> = {
   (input: string, options: any): T
}

interface Location {
   offset: number
   line: number
   column: number
}

type ExposedFunction = { type: 'function'; name: string }

type ExposedType = { type: 'type'; name: string }

type ExposedConstructor = { type: 'constructor'; name: string }

type ExposedAll = { type: 'all' }

type Exposed = ExposedAll | ExposedFunction | ExposedType | ExposedConstructor

interface ImportStatement {
   type: 'import'
   location: Location
   module: string
   alias: string
   exposing: Exposed[]
}
interface Module {
   type: 'module'
   location: Location
   module: string
   exposing: Exposed[]
   imports: ImportStatement[]
}

export const ModuleParser = loadParser<Module>('elm_module_parser')

function loadParser<T>(path: string): Parser<T> {
   return require(`./parsers/${path}`)
}
