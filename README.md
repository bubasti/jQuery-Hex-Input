Hex Exploding Input is a jQuery Widget Factory plugin with Themeroller support.

### Example:
    $('#hex-input').hexInput({
      value: 'f',
      digits: 2,
      zero_based: false,
      spinner: true,
      spinner_opts: {
        spin: function(e) {
          console.log('Spin!');
        },
      }
    });

### Options
 
 * **value**: Hex String or Number
 * **digits**: Default: 8, Total number of digits to show in the Hex String and Exploded Hex Inputs
 * **zero_based**: Default: true, A boolean to have the labels start at 0
 * **spinner**: Default: true, A boolean to make the default input a jQuery 1.9 Spinner Widget.  Spinner is currently only supported for digits < 15.
 * **spinner_opts**: Default: {}, pass options onto the creation of the spinner.
     Cannot override 'min', which is 0 by default
     Cannot override 'max', which is determined by 'digits'

Demo located [here](http://dl.dropbox.com/u/21019978/jQuery-Hex-Input/example.html).
Demo located [here](http://jsfiddle.net/gh/get/jquery/1.8.3/dependencies/UI/hurgleburgler/jQuery-Hex-Input/tree/master/demo/).
