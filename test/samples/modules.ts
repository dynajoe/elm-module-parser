import { Module } from '../../src/module_parser'

export const MODULE_DECLARATION = `module Modules.Foo.Bar exposing (Constructor(..), SomeType, someFn, Msg(..), Step(..))`

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
`

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
`

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
            offset: 88,
            line: 3,
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
            offset: 116,
            line: 4,
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
            offset: 152,
            line: 5,
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
            offset: 188,
            line: 6,
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
            offset: 293,
            line: 12,
            column: 1,
         },
         type: 'import',
         module: 'String',
         alias: null,
         exposing: [],
      },
      {
         location: {
            offset: 337,
            line: 14,
            column: 1,
         },
         type: 'import',
         module: 'Tuple',
         alias: null,
         exposing: [],
      },
      {
         location: {
            offset: 350,
            line: 15,
            column: 1,
         },
         type: 'import',
         module: 'Browser',
         alias: null,
         exposing: [],
      },
      {
         location: {
            offset: 366,
            line: 17,
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
            offset: 417,
            line: 20,
            column: 1,
         },
         type: 'import',
         module: 'Html.Events',
         alias: null,
         exposing: [],
      },
      {
         location: {
            offset: 468,
            line: 21,
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
            offset: 520,
            line: 22,
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
            offset: 547,
            line: 23,
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
   functions: [
      {
         name: 'shuffleList',
         type: 'function-definition',
         location: {
            line: 26,
            offset: 585,
            column: 1,
         },
      },
      {
         name: 'main',
         type: 'function-definition',
         location: {
            offset: 902,
            line: 37,
            column: 1,
         },
      },
   ],
   types: [
      {
         type: 'custom-type',
         name: 'Msg',
         location: {
            offset: 1141,
            line: 49,
            column: 1,
         },
      },
      {
         type: 'type-alias',
         name: 'Model',
         location: {
            offset: 1793,
            line: 78,
            column: 1,
         },
      },
   ],
}
