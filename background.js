setTimeout(function () {
    $('<button id="data-card-toggle" class="button active">Toggle searchable & filterable datatable</button>').insertBefore('.trades-filter');
    $('<div id="data-card" class="card" style="margin-top: 15px;"><button id="toggle-images">Toggle Images</button><div class="card-container"><div style="color: black;"><table id="example" class="display" width="100%"></table></div></div></div>').insertBefore('.trades-filter');

    $( "#data-card-toggle" ).click(function() {
        $('#data-card').toggle();
    });
    $( "#toggle-images" ).click(function() {
        const table = $('#example').DataTable();
        if (table.column(0).visible() === true) {
            table.column(0).visible(false);
        }
        else {
            table.column(0).visible(true); 
        }
    });
}, 2000);

setTimeout(async function () {
    try {
        const getCookieValue  = (name) => (
            document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
        );
    
        const bountyIdCookie = getCookieValue('bountyId'); 
    
        // data to be sent to the POST request
        let _data = {
            "bounty_id": bountyIdCookie
        };

        let dataSet = [];
        
        await fetch('https://api2.hirezstudios.com/bounty/get-user-info-sales-2', {
            method: "POST",
            body: JSON.stringify(_data),
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => response.json()) 
        .then(json => {
            json.stackables.forEach( item => {
                // convert to lowercase and replace spaces with underscores
                let imageFileName = `${item.metadata.champion.toLowerCase()}_${item.metadata.name.toLowerCase().replaceAll(' ', '-')}`;
                let imageFilePath = `https://webcdn.hirezstudios.com/web/bounty/icons/${imageFileName}.jpg`;
                let newObj = [
                    `<img src=${imageFilePath} style='height:100px; width:100px'>`,
                    item.metadata.champion,
                    item.metadata.name,
                    item.price
                ];

                dataSet.push(newObj);
            });

            $('#example').DataTable( {
                data: dataSet,
                columns: [
                    { title: "Image", 'visible' : false },
                    { title: "Champion" },
                    { title: "Skin Name" },
                    { title: "Price" }
                ]
            } );

            $('#data-card').hide();
        })
        .catch(err => console.log(err));
    } catch (error) {
        console.log(error);
    }
}, 3000);
