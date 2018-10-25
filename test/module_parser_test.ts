import { expect } from 'chai'
import { ModuleParser } from '../src/index'
import * as S from './samples/modules'

describe('Module Parser', () => {
   it('should parse a file with only module declaration', () => {
      const result = ModuleParser(`${S.MODULE_DECLARATION}`)
      expect({ ...S.ExpectedModule, imports: [], functions: [], types: [] }).to.deep.equal(result)
   })

   it('should parse port modules declarations', () => {
      const result = ModuleParser(`port ${S.MODULE_DECLARATION}`)
      expect({ ...S.ExpectedModule, type: 'port-module', imports: [], functions: [], types: [] }).to.deep.equal(result)
   })

   it('should parse a module along with its imports', () => {
      const result = ModuleParser(`${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}`)
      expect({ ...S.ExpectedModule, functions: [], types: [] }).to.deep.equal(result)
   })

   it('should parse a module along with its type and function definitions', () => {
      const result = ModuleParser(`${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}\n${S.REST_OF_MODULE}`)
      expect(S.ExpectedModule).to.deep.equal(result)
   })
})
