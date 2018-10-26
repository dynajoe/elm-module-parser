import { expect } from 'chai'
import { ModuleParser } from '../src/index'
import * as S from './samples/modules'

describe('Module Parser', () => {
   const runParser = (input: string) => {
      try {
         return ModuleParser(input)
      } catch (error) {
         return error
      }
   }

   it('should parse a file with only module declaration', () => {
      const result = runParser(`${S.MODULE_DECLARATION}`)
      expect(result).to.deep.equal({ ...S.ExpectedModule, imports: [], functions: [], types: [] })
   })

   it('should parse port modules declarations', () => {
      const result = runParser(`port ${S.MODULE_DECLARATION}`)
      expect(result).to.deep.equal({ ...S.ExpectedModule, type: 'port-module', imports: [], functions: [], types: [] })
   })

   it('should parse a module along with its imports', () => {
      const result = runParser(`${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}`)
      expect(result).to.deep.equal({ ...S.ExpectedModule, functions: [], types: [] })
   })

   it('should parse a module along with its type and function definitions', () => {
      const input = `${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}\n${S.REST_OF_MODULE}`
      const result = runParser(input)
      expect(result).to.deep.equal(S.ExpectedModule)
   })
})
