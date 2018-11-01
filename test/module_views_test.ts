import { Views } from '../src/module_views'
import { Module } from '../src/module_parser'
import { expect } from 'chai'

describe('importedView', () => {
   it('should import all exposed from the other module', () => {
      const this_module: Module = {
         name: 'A',
         types: [],
         text: '',
         location: null,
         function_declarations: [],
         function_annotations: [],
         exposes_all: false,
         exposing: [],
         imports: [
            {
               module: 'B',
               type: 'import',
               location: null,
               exposing: [],
               exposes_all: true,
               alias: null,
            },
         ],
         type: 'module',
      }

      const other_module: Module = {
         name: 'B',
         types: [
            {
               name: 'MyName',
               constructors: [
                  {
                     name: 'Foo',
                     type: 'constructor',
                     location: null,
                  },
                  {
                     name: 'Bar',
                     type: 'constructor',
                     location: null,
                  },
               ],
               type: 'custom-type',
               location: null,
            },
            {
               name: 'MyTypeAlias',
               type: 'type-alias',
               location: null,
            },
         ],
         text: '',
         location: null,
         function_declarations: [
            {
               name: 'foo',
               parameters: [],
               type: 'function-declaration',
               location: null,
            },
            {
               name: 'noAnnotationFunction',
               parameters: [],
               type: 'function-declaration',
               location: null,
            },
         ],
         function_annotations: [
            {
               name: 'foo',
               type: 'function-annotation',
               location: null,
            },
         ],
         exposes_all: true,
         exposing: [],
         imports: [],
         type: 'module',
      }

      const view = Views.importedView(this_module, other_module)
      const expected: Views.ModuleView = {
         perspective: this_module.name,
         name: other_module.name,
         type: other_module.type,
         types: other_module.types,
         functions: [
            {
               name: other_module.function_declarations[0].name,
               declaration: other_module.function_declarations[0],
               annotation: other_module.function_annotations[0],
            },
            {
               name: other_module.function_declarations[1].name,
               declaration: other_module.function_declarations[1],
               annotation: null,
            },
         ],
      }

      expect(view).to.deep.equal(expected)
   })
})
