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
