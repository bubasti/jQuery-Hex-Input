  $('#hex-input1').hexInput({
    value: 'f',
    digits: 2,
    zero_based: false,
    spinner: false,
  });

  $('#hex-input2').hexInput({
    value: '0xf',
    digits: 6,
    spinner: true,
    spinner_opts: {
      spin: function(e) {
        console.log('Spin!');
      },
    }
  });

  $('#hex-input3').hexInput({
    value: '0xb00b1e',
    digits: 14,
    spinner: false,
  });


  $('#hex-input4').hexInput({
    value: '0x123456789abcde',
    digits: 18,
    spinner: true,
  });

  $('#hex-input5').hexInput({
    value: '0x123456789abcde',
    digits: 26,
    spinner: false,
  });

  $('#hex-input6').hexInput({
    value: 'fffffff',
    spinner: true,
    onChange: function(e) {
      console.log('changed');
    },
  });
