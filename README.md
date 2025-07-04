# Super Mario Bros 3 Card Matching Converted to Python

Main game is the file: smb3match.py

You must copy the assets to a folder called "assets" where the program is located.

<br>

This project was mainly starting with a concept and assets and creating the correct game mechanics in Python.


<br><br>

#### OLD PREVIOUS VERSION:

## Play in Browser: https://hiddenwaffle.github.io/matching/

The Super Mario Bros 3 card matching game, ported to ReactJS

## Credits

* Graphics - https://www.spriters-resource.com/nes/supermariobros3/sheet/105023/
  * Background color scheme - https://davidmathlogic.com/colorblind/
  * Color lightener/darkener - https://pinetools.com/c-colors/
* Card Layouts - https://www.mariowiki.com/N-Mark_Spade_Panel
* Sound Effects - https://themushroomkingdom.net/media/smb3/wav
* Font - https://www.dafont.com/super-mario-bros-3.font by [david-fens.d5063](https://www.dafont.com/david-fens.d5063), converted to WOFF2 by https://transfonter.org/

## Challenges

* Modifying elements of an array during `setTimeout()` can be tricky because user actions could have modified elements of the same array in a different `setTimeout()` call.
  * Workaround: Move the element accesses to a `useEffect()` and have the `setTimeout()` modify a (potentially arbitrary) value that the `useEffect()` is watching.
* Mobile CSS is chaotic and unpredictable

## Deploy

```
rm -rf docs
npm run build
mv dist docs
```

## Why React?

I needed to refresh my memory after having not used it for several years. It would have been better to use Canvas for an app like this.
