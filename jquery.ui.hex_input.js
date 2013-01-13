$(function() {
  // JShexInput Widget
  // the widget definition, where "custom" is the namespace,
  $.widget( "custom.hexInput", {
    // default options
    options: {
      value: 0,
      digits: 8,
      zero_based: true,
      spinner: true,
      spinner_opts: {},
 
      // callbacks
      onChange: null,
      onBlur: null,
      beforeCreate: null,
      afterCreate: null,
      beforeExpand: null,
      afterExpand: null,
      beforeCollapse: null,
      afterCollapse: null,
    },
  
    // the constructor
    _create: function() {
      this._trigger('beforeCreate');

      if (!this.element.is('input')) {
        return;
      }

      var this_element = this;
      var $this_element = (this.element)
        // add a class for theming
        .addClass( 'custom-hexInput-input' )
        .change(function(e) {
          this_element._setOption('value', $(this).val());
        });

      $this_element
        .wrap($( document.createElement('span'))
          .addClass('custom-hexInput ui-widget'));

           if (this_element.options.spinner) {
            $this_element
              .spinner(
                $.extend(true, {}, this_element.options.spinner_opts, {
                    min: 0,
                })
              )
              .on('spin', function(e, u) {
                this_element._setOption('value', u.value);
                return false;
            });
          }

      this.this_wrapper = $this_element.parent();

      this.hex_wrapper = $( document.createElement('span'))
        .addClass('custom-hexInput-hex')
        .hide();

      for (var ii = 0; ii < this.options.digits; ii++) {
        var $this_group = $( document.createElement('div'))
          .addClass('custom-hexInput-hexInputGroup')

        $( document.createElement('input'))
          .addClass('custom-hexInput-hexInput')
          .data('hexIndex', ii)
          .attr('type', 'text')
          .appendTo($this_group)
          .bind('keydown', function(e) {
            if (e.which === 38 || e.which === 40) {
              var this_val = parseInt($(this).val(), 16) + 1;
              if (e.which === 40) {
                this_val = this_val - 2;
                if (this_val < 0) {
                  this_val = 15;
                }
              }
              $(this).val(((this_val)%16).toString(16));

              this_element._trigger('onChange');

            } else if (e.which === 13) {
              $(this).parent().next().find('.custom-hexInput-hexInput').focus().select();
            }
          })
          .blur(function(e) {
            $(this).val((parseInt($(this).val(), 16) || 0).toString(16));
          });

        var $this_label = $( document.createElement('label'))
          .addClass('custom-hexInput-hexInputLabel')
          .appendTo($this_group)
          .html(ii);

        if (!this.options.zero_based) { 
          $this_label.html(ii + 1);
        }

          $this_group.prependTo(this.hex_wrapper);
      }

      this.hex_collapser = $( document.createElement('span'))
        .addClass('custom-hexInput-hexCollapse ui-icon ui-icon-secondary ui-icon-circlesmall-minus')
        .attr('title', 'Collapse')
        .click(function(e) {
          this_element._collapse();
        })
        .appendTo(this.hex_wrapper);

      this.hex_wrapper
        .appendTo(this.this_wrapper);

      this.hex_expander = $( document.createElement('span'))
        .addClass('custom-hexInput-hexExpand ui-icon ui-icon-secondary ui-icon-circlesmall-plus')
        .attr('title', 'Expand')
        .click(function(e) {
          this_element._expand();
        })
        .appendTo(this.this_wrapper);

      this.this_wrapper.find('input').bind('change', this.options.onChange);
      this.this_wrapper.find('input').bind('blur', this.options.onBlur);

      this._refresh();

      // Make sure this is the final step of the create function
      this_element._trigger('afterCreate');
    },
    _destroy: function() {
      //// remove generated elements
      //this.changer.remove();
      this.element
        .removeClass( "custom-hexInput" );
    },
    // _setOptions is called with a hash of all options that are changing
    // always refresh when changing options
    _setOptions: function() {
      // _super and _superApply handle keeping the right this-context
      this._superApply( arguments );
    },
    // _setOption is called for each individual option that is changing
    _setOption: function( key, value ) {
      this._super( key, value );
      this._refresh();
    },
    _refresh: function() {
      var norm_val = this.options.value.toString(16);

      if (norm_val.indexOf('0x') !== -1) {
        norm_val = norm_val.split('0x')[1];
      }

      if (norm_val.length < this.options.digits) {
        zeros = new Array(this.options.digits - norm_val.length);
        for (var i = 0; i < zeros.length; i++) zeros[i] = 0;
        norm_val = zeros.concat(norm_val.split('')).join('');
      } else if (norm_val.length > this.options.digits) {
        zeros = new Array(this.options.digits);
        for (var i = 0; i < zeros.length; i++) zeros[i] = 0;
        norm_val = zeros.join('');
      }
      this.element.val('0x' + norm_val);
    },
    _expand: function() {
      var this_element = this;
      var $this_element = (this.element);

      this._trigger('beforeExpand');
      $this_element
        .parents('.ui-spinner')
        .removeClass('ui-widget-content')
        .find('a.ui-spinner-button')
        .hide();

      this_element.hex_expander.hide();
      $this_element.hide('fade', function() {
        var this_hex_str = $this_element.val().split('0x')[1].split('').reverse().join('');
        this_element._trigger('afterExpand');
        this_element.hex_wrapper
          .show('fade')
          .css('display', 'inline-block')
          .find('input.custom-hexInput-hexInput')
          .each(function(ii, elem) {
            var $this_elem = $(elem);
            var this_ndx = $this_elem.data('hexIndex');
            if (this_hex_str[this_ndx]) {
              $this_elem.val((parseInt(this_hex_str[this_ndx], 16) || 0).toString(16));
            } else {
              $this_elem.val(0);
            }
          });
      });
    },
    _collapse: function() {
      var this_element = this;
      var $this_element = (this.element);

      this._trigger('beforeCollapse');
      this_element.hex_wrapper.hide(
        'fade',
        function() {
          $this_element
            .parents('.ui-spinner')
            .addClass('ui-widget-content')
            .find('a.ui-spinner-button')
            .show();

          this_element._trigger('afterCollapse');

          replaceAt = function(str, index, char) {
             return str.substr(0, index) + char + str.substr(index+char.length);
          };

          var this_hex_str = new Array(this_element.options.digits);
          this_element.hex_wrapper
            .find('input.custom-hexInput-hexInput')
            .each(function(ii, elem) {
              var this_ndx = $(elem).data('hexIndex');
              this_hex_str[this_ndx] = (parseInt($(elem).val(), 16) || 0).toString(16);
            });

          this_element._setOption('value', this_hex_str.reverse().join(''));

          $this_element.show('fade');
          this_element.hex_expander.show();
        }
      );
    },
  });
});



