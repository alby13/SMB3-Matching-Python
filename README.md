# matching

A Super Mario Bros 3 match game clone

## Credits

* Graphics - https://www.spriters-resource.com/nes/supermariobros3/sheet/105023/
  * Background color scheme - https://davidmathlogic.com/colorblind/#%23D81B60-%231E88E5-%23FFC107-%23004D40
* Card Layouts - https://www.mariowiki.com/N-Mark_Spade_Panel
* Sound Effects - https://themushroomkingdom.net/media/smb3/wav
* Music - https://www.mariowiki.com/File:N_Spade_Theme_Super_Mario_Bros_3.oga
* Font - https://www.dafont.com/super-mario-bros-3.font by [david-fens.d5063](https://www.dafont.com/david-fens.d5063), converted to WOFF2 by https://transfonter.org/

## Challenges

Modifying elements of an array during `setTimeout()` can be tricky because user actions could have modified elements of the same array in a different `setTimeout()` call.
Workaround: Move the card accesses to a `useEffect()` and have the `setTimeout()` modify the (potentially arbitrary) value that the `useEffect()` is watching.
