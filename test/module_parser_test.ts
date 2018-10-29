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

      expect(
         result.imports.map(x => ({
            module: x.module,
            alias: x.alias,
            exposes_all: x.exposes_all,
            exposing: x.exposing.map(e => e.name),
         }))
      ).to.deep.equal([
         { module: 'Basics', alias: null, exposes_all: true, exposing: [] },
         { module: 'List', alias: null, exposes_all: false, exposing: ['(::)'] },
         { module: 'Maybe', alias: null, exposes_all: false, exposing: ['Maybe'] },
         { module: 'Result', alias: null, exposes_all: false, exposing: ['Result'] },
         { module: 'String', alias: null, exposes_all: false, exposing: [] },
         { module: 'Tuple', alias: null, exposes_all: false, exposing: [] },
         { module: 'Browser', alias: null, exposes_all: false, exposing: [] },
         { module: 'Html', alias: null, exposes_all: false, exposing: ['Html', 'button', 'div', 'text'] },
         { module: 'Html.Events', alias: null, exposes_all: false, exposing: ['onClick', 'A', 'c', 'E'] },
         { module: 'Foo.Bar', alias: 'Baz', exposes_all: false, exposing: ['B', 'C', 'D', 'E'] },
         { module: 'Plink', alias: null, exposes_all: true, exposing: [] },
         { module: 'Kluck', alias: null, exposes_all: false, exposing: ['Chicken'] },
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
