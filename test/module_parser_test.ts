import { expect } from 'chai'
import { ModuleParser, Module, CustomTypeDeclaration } from '../src/index'
import * as S from './samples/modules'

describe('Module Parser', () => {
   const runParser = (input: string): Module => {
      try {
         return ModuleParser(input)
      } catch (error) {
         return error
      }
   }

   it('should parse a file with only module declaration', () => {
      const result = runParser(`${S.MODULE_DECLARATION}`)
      expect(result.type).to.equal('module')
   })

   it('should parse port modules declarations', () => {
      const result = runParser(`port ${S.MODULE_DECLARATION}`)
      expect(result.type).to.equal('port-module')
   })

   it('should parse a module along with its imports', () => {
      const result = runParser(`${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}`)

      expect(result.imports.map(x => x.module)).to.deep.equal([
         'Basics',
         'List',
         'Maybe',
         'Result',
         'String',
         'Tuple',
         'Browser',
         'Html',
         'Html.Events',
         'Foo.Bar',
         'Plink',
         'Kluck',
      ])
   })
   describe('full module', () => {
      const input = `${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}\n${S.REST_OF_MODULE}`
      let result: Module = null

      before(() => {
         result = runParser(input)
      })

      it('function annotations', () => {
         expect(result.function_annotations.map(d => d.name)).to.deep.equal(['shuffleList', 'main'])
      })

      it('custom types', () => {
         expect(result.types.filter(x => x.type === 'custom-type').map(d => d.name)).to.deep.equal(['Msg', 'Foo'])
      })

      it('custom type variants', () => {
         const msgType = result.types.find(x => x.type === 'custom-type' && x.name === 'Msg') as CustomTypeDeclaration

         expect(msgType.constructors.map(x => ({ name: x.name, type: x.type }))).to.deep.equal([
            { name: 'Shuffle', type: 'constructor' },
            { name: 'Update', type: 'constructor' },
         ])
      })

      it('function declarations', () => {
         expect(result.function_declarations.map(d => ({ name: d.name, parameters: d.parameters }))).to.deep.equal([
            { name: 'shuffleList', parameters: ['list'] },
            { name: 'main', parameters: [] },
            { name: 'init', parameters: ['_'] },
            { name: 'update', parameters: ['msg', 'model'] },
            { name: 'view', parameters: ['model', 'foo', 'bar'] },
         ])
      })
   })
})
