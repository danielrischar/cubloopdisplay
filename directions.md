# Directions for creating a Plaque


## Wood
I use 1/2" thick, 2.5" wide, 3' long oak boards from Home Depot. These are readily available and easy to work with. The 3' length allows you to cut three plaques from each board with minimal waste. The kerf (width of material removed by the saw blade), is why I use 11.75" instead of 12".

You should try to keep the wood and stain options consistent per child so that their display matches over the years.

1. Cut them into 11.75" lengths.
2. Sand them
3. Stain them.  I used Varathane Early American.
4. Wait.  Whether you are laser engraving or ironing on vinyl you want the stain to be completely cured before you apply the graphics.

## TGraphics
1. Use the web app to generate images to be vinyl cut, ironed on, or laser engraved into the wood.  The app provides SVG and PNG downloads, but the SVG is not a true SVG, it has embedded images in it rather than paths.  The software for your tool should be able to manage this.  
2. Resize the image in your software.  As you convert from pixels (image) to inches (the board) you will need to resize these.  The image should end up 2" tall, which scales everything to fit onto the board size above.  If your boards are larger, then scale differently, but this is as small as you can go while still fitting the loops.
3. Apply the images to the boards in the manner of your choosing.

## Hanging Hardware
TODO: explain how to use the drill guide, drill bit size, hook eye details, and cuttingthe upper eye into a hook.

# Loop Holders
The loop holders are 3D printed from the file located in (models/loopholder_v1.stl)[models/loopholder_v1.stl] (or a more recent version if named as such).
These should be printed with the following characteristics:
* **Nozle Height** - .4 or a .6 for speed.
* **Layer Height** - As high as you can make it.
* **Material** - PETG will work best for long term stability.  Avoid PLA, but ASA or ABS could be used, though they would be overkill.
* **Infill** - 15%, small enough that it doesn't matter.
* **Orientation** - Standing on one edge allows for no supports.
* **Brim** - Use a brim to increase the surface area on the plate if you have adhesion issues for something tall and narrow.

This is a pretty simple print.  The model is set to ~4.25" tall, you will need 4 of these per plaque.  If you have a larger format printer capable of printing 216mm in height reliably (I don't trust mine not to wobble at that height), you could print each bar as one print.

I'm considering design changes that would allow a horizontal print that can be faster and more stable.

Once printed, these can be glued onto the rank plaques.