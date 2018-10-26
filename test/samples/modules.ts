import { Module } from '../../src/module_parser'

export const MODULE_DECLARATION = `
module Modules.Foo.Bar exposing (Constructor(..), SomeType, someFn, Msg(..), Step(..))
`.trim()

export const IMPORT_LIST = `
import Basics exposing (..)
import List exposing ( List, (::) )
import Maybe exposing ( Maybe(..) )
import Result exposing ( Result(..) )
-- this is a test
----- so many
{-----
import NotToBeImported
  -}
import String
-- import AlsoNotToBeImported
import Tuple
import Browser

import Html exposing (Html,
 button, div, text
  )
import Html.Events exposing (onClick, A, c, E(AS))
import Foo.Bar as Baz exposing (B, C(..), D, E(..))
import Plink exposing (..)
import Kluck exposing (Chicken(..))
`.trim()

export const REST_OF_MODULE = `
shuffleList : List a -> Random.Generator (List a)
shuffleList list =
    Random.list (List.length list) (Random.float 0 1)
        |> Random.map
            (\rs ->
                List.map2 Tuple.pair list rs
                    |> List.sortBy Tuple.second
                    |> List.map Tuple.first
            )


main : Program () { values : List Int } Msg
main =
    Browser.element { init = init, update = update, view = view, subscriptions = always Sub.none }


init _ =
    ( { values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
      }
    , Cmd.none
    )


type Msg
    = Shuffle
    | Update (List Int)


update msg model =
    case msg of
        Shuffle ->
            ( model, Random.generate Update (shuffleList model.values) )

        Update list ->
            ( { model | values = list }, Cmd.none )


view model =
    div []
        [ button [ onClick Shuffle ] [ text "Shuffle" ]
        , Html.Keyed.node "div" [] <|
            List.map
                (\value ->
                    ( String.fromInt value
                    , div []
                        [ text <| String.fromInt value
                        ]
                    )
                )
                model.values
        ]

type alias Model =
    { a : A
    , bbbb : B
    , cDEfG : C
    }
`.trim()

export const ExpectedModule: Module = {
   location: {
      offset: 0,
      line: 1,
      column: 1,
   },
   type: 'module',
   name: 'Modules.Foo.Bar',
   exposing: [
      {
         type: 'constructor',
         name: 'Constructor',
      },
      {
         type: 'type',
         name: 'SomeType',
      },
      {
         type: 'function',
         name: 'someFn',
      },
      {
         type: 'constructor',
         name: 'Msg',
      },
      {
         type: 'constructor',
         name: 'Step',
      },
   ],
   imports: [
      {
         location: {
            offset: 87,
            line: 2,
            column: 1,
         },
         type: 'import',
         module: 'Basics',
         alias: null,
         exposing: [
            {
               type: 'all',
            },
         ],
      },
      {
         location: {
            offset: 115,
            line: 3,
            column: 1,
         },
         type: 'import',
         module: 'List',
         alias: null,
         exposing: [
            {
               type: 'type',
               name: 'List',
            },
            {
               type: 'function',
               name: '(::)',
            },
         ],
      },
      {
         location: {
            offset: 151,
            line: 4,
            column: 1,
         },
         type: 'import',
         module: 'Maybe',
         alias: null,
         exposing: [
            {
               type: 'constructor',
               name: 'Maybe',
            },
         ],
      },
      {
         location: {
            offset: 187,
            line: 5,
            column: 1,
         },
         type: 'import',
         module: 'Result',
         alias: null,
         exposing: [
            {
               type: 'constructor',
               name: 'Result',
            },
         ],
      },
      {
         location: {
            offset: 292,
            line: 11,
            column: 1,
         },
         type: 'import',
         module: 'String',
         alias: null,
         exposing: [],
      },
      {
         location: {
            offset: 336,
            line: 13,
            column: 1,
         },
         type: 'import',
         module: 'Tuple',
         alias: null,
         exposing: [],
      },
      {
         location: {
            offset: 349,
            line: 14,
            column: 1,
         },
         type: 'import',
         module: 'Browser',
         alias: null,
         exposing: [],
      },
      {
         location: {
            offset: 365,
            line: 16,
            column: 1,
         },
         type: 'import',
         module: 'Html',
         alias: null,
         exposing: [
            {
               type: 'type',
               name: 'Html',
            },
            {
               type: 'function',
               name: 'button',
            },
            {
               type: 'function',
               name: 'div',
            },
            {
               type: 'function',
               name: 'text',
            },
         ],
      },
      {
         location: {
            offset: 416,
            line: 19,
            column: 1,
         },
         type: 'import',
         module: 'Html.Events',
         alias: null,
         exposing: [],
      },
      {
         location: {
            offset: 467,
            line: 20,
            column: 1,
         },
         type: 'import',
         module: 'Foo.Bar',
         alias: 'Baz',
         exposing: [
            {
               type: 'type',
               name: 'B',
            },
            {
               type: 'constructor',
               name: 'C',
            },
            {
               type: 'type',
               name: 'D',
            },
            {
               type: 'constructor',
               name: 'E',
            },
         ],
      },
      {
         location: {
            offset: 519,
            line: 21,
            column: 1,
         },
         type: 'import',
         module: 'Plink',
         alias: null,
         exposing: [
            {
               type: 'all',
            },
         ],
      },
      {
         location: {
            offset: 546,
            line: 22,
            column: 1,
         },
         type: 'import',
         module: 'Kluck',
         alias: null,
         exposing: [
            {
               type: 'constructor',
               name: 'Chicken',
            },
         ],
      },
   ],
   types: [
      {
         constructors: [
            {
               type: 'constructor',
               name: 'Shuffle',
               location: {
                  offset: 1153,
                  line: 47,
                  column: 7,
               },
            },
            {
               type: 'constructor',
               name: 'Update',
               location: {
                  offset: 1167,
                  line: 48,
                  column: 7,
               },
            },
         ],
         type: 'custom-type',
         name: 'Msg',
         location: {
            offset: 1138,
            line: 46,
            column: 1,
         },
      },
      {
         type: 'type-alias',
         name: 'Model',
         location: {
            offset: 1790,
            line: 75,
            column: 1,
         },
      },
   ],
   functions: [
      {
         type: 'function-definition',
         name: 'shuffleList',
         location: {
            offset: 582,
            line: 23,
            column: 1,
         },
      },
      {
         type: 'function-definition',
         name: 'main',
         location: {
            offset: 899,
            line: 34,
            column: 1,
         },
      },
   ],
}
