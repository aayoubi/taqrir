define(function (require) {
    const React = require('react')
    const $ = require('jquery')

    const handleFileSelect = function(evt, callback) {
        const reader = new FileReader();

        reader.onerror = function(e) {
          switch(e.target.error.code) {
              case evt.target.error.NOT_FOUND_ERR:
                  alert('File Not Found!');
                  break;
              case evt.target.error.NOT_READABLE_ERR:
                  alert('File is not readable');
                  break;
              case evt.target.error.ABORT_ERR:
                  break;
              default:
                  alert('An error occurred reading this file.');
          };
        }

        reader.onabort = function(e) {
            alert('File read cancelled');
        };

        reader.onload = function(e) {
            const xmlDoc = $.parseHTML(this.result);
            const reportData = []

            // entry[0]  -> username
            // entry[6]  -> activity date
            // entry[8]  -> activity label
            // entry[10] -> activity cost

            try {
              $.each($(xmlDoc).find('tr'), function(i, tr) {
                  var entry = [];
                  var tableData = $(this).find('td');
                  if (tableData.length > 0) {
                      tableData.each(function() { entry.push($(this).text()); });
                      reportData.push( {"user": entry[0], "activity": entry[8], "date": entry[6], "waste": parseFloat(entry[10]) } );
                  }
              });
            } catch (err) {
              callback('error', []);
            }
            callback('success', reportData);
        };
        const files = evt.target.files; // FileList object
        reader.readAsText(files[0], "UTF-8");
    }

    const FileSelector = React.createClass({
      onChange: function(evt) {
        var callback = function(status, data) {
          if (status === 'error') {
            console.log('Failed to read and parse the provided mxtime report');
            this.props.onFileSelect([]);
          } else {
            this.props.onFileSelect(data);
          }
        }.bind(this);
        handleFileSelect(evt, callback);
      },
      render: function() {
        return (
          <div className="fileSelector">
            <input type="file" id="files" onChange={this.onChange}/>
          </div>
        );
      }
    });

    return FileSelector;
});
