import { TypeDeclaration, FunctionAnnotation, Module, FunctionDeclaration, ImportStatement } from './module_parser'
import { keyBy } from './util'

export namespace Views {
   export interface ModuleView {
      type: 'module' | 'port-module'
      perspective: string
      name: string
      types: TypeDeclaration[]
      functions: { name: string; declaration: FunctionDeclaration; annotation: FunctionAnnotation }[]
   }

   export function importedView(this_module: Module, other_module: Module): ModuleView | null {
      const module_import: ImportStatement = this_module.imports.find(i => i.module === other_module.name)

      if (module_import == null) {
         return null
      }

      const exposed_view = { ...exposedView(other_module), perspective: this_module.name }

      if (module_import.exposes_all) {
         return exposed_view
      }

      const imported_by_name = keyBy(module_import.exposing, e => e.name)

      return {
         ...exposed_view,
         types: exposed_view.types.filter(t => imported_by_name[t.name] != null),
         functions: exposed_view.functions.filter(f => imported_by_name[f.name] != null),
      }
   }

   export function exposedView(module: Module): ModuleView {
      const exposing_by_name = keyBy(module.exposing, e => e.name)

      const exposed_types = module.exposes_all
         ? module.types
         : module.types.filter(t => {
              if (exposing_by_name[t.name] == null) {
                 return false
              }

              if (exposing_by_name[t.name].type === 'constructor') {
                 return t.type === 'custom-type'
              } else if (exposing_by_name[t.name].type === 'type') {
                 return t.type === 'type-alias'
              } else {
                 return false
              }
           })

      const annotations_by_name = keyBy(module.function_annotations, f => f.name)
      const declarations_by_name = keyBy(module.function_declarations, f => f.name)
      const all_function_names = [
         ...new Set(Object.keys(annotations_by_name).concat(Object.keys(declarations_by_name))),
      ]

      const functions = all_function_names.map(n => {
         return {
            name: n,
            annotation: annotations_by_name[n] || null,
            declaration: declarations_by_name[n] || null,
         }
      })

      return {
         perspective: module.name,
         type: module.type,
         name: module.name,
         types: exposed_types,
         functions: functions,
      }
   }
}
