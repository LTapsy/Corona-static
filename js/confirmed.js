var coronaV
arr = [];
result = [];
function initialLoad(){
    var covid
    fetch("https://cors-anywhere.herokuapp.com/" + "https://coronavirus-tracker-api.herokuapp.com/confirmed", {
        "method": "GET"
    })
    .then(res => res.json())          
    .then(covid => {
        console.log(covid);
        // alert(JSON.stringify(covid));
    
        var confirmed ="";
    
    
        confirmed += "<h1>"+covid.latest+"</h1>";
        confirmed += "<h3>Confirmed Cases WorldWide</h3>";
        
        $(".cases").html(confirmed);

        coronaV = covid;
        

        var locations = "";
        
        var locations = "";
        var arse = covid.locations
        function compare(a,b){
            const locA = a.latest
            const locB = b.latest

            let comparison = 0;

            if(locA > locB){
                comparison = 1;
            }else if(locA < locB){
                comparison = -1;
            }
            return comparison * -1;
        }

        arse.sort(compare)

        // for(x = 0; x!= covid.locations.length;x++){
        for(x = 0; x!= covid.locations.length;x++){
            // console.log(covid.locations[x].province);
            if(covid.locations[x].latest != "0"){
                if(covid.locations[x].province == ""){
                    locations += `<div class="locations" data-toggle="modal" data-target="#myModal" onclick="renderChart(`+ x +`)"><i class="fas fa-biohazard"></i><p  class="pwestuhan">`+covid.locations[x].country+`</p><p class="caseCount">Count: `+covid.locations[x].latest+`</p></div>`;
                }else{
                    locations += `<div class="locations"  data-toggle="modal" data-target="#myModal" onclick="renderChart(`+ x +`)"><i class="fas fa-biohazard"></i><p  class="pwestuhan">`+covid.locations[x].province+", "+covid.locations[x].country+`</p><p class="caseCount">Count: `+covid.locations[x].latest+`</p></div>`;
                }
            }
            var ass = covid.locations[x].history
            
            for(i=0; i != 59 ;  i++){
                arr.push({"date":Object.keys(ass)[i], "number" : Object.values(ass)[i]}) //this is whre i reconstruct the array thatt the api gave us, because before it was date: number, i changed it to date: date, number: number
            }
        }
        function chunkArray(myArray, chunk_size){ //this is where i divide the whole array which is 20k+ by 59 so each contry has its own formatted array of date and numbers
            var index = 0;
            var arrayLength = arr.length;
            var tempArray = [];
            
            for (index = 0; index < arrayLength; index += chunk_size) {
                myChunk = myArray.slice(index, index+chunk_size);
                // Do something if you want with the group
                tempArray.push(myChunk);
            }
        
            return tempArray;
        }
        result = chunkArray(arr, 59); //existing array that is divided by 59
        
        $(".locationContainer").html(locations);
        $(".loadingScreen").hide();
        
    })
    .catch(err => {
        console.log(err);
    });
    
    
    
    }initialLoad();
    
    
    
function regenerate(){
    var locations = "";
    var inputValue = document.querySelector('#myInput').value;
    var filtered = coronaV.locations.filter(function (el) {
        return el.country.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        });
    // for(x = 0; x!= covid.locations.length;x++){
        
    if(inputValue !== ''){
        for(x = 0; x!= filtered.length;x++){
        // console.log(covid.locations[x].province);
        
            if(filtered[x].province == ""){
                locations += `<div class="locations"  data-toggle="modal" data-target="#myModal" onclick="renderChart(`+ x +`)"><i class="fas fa-biohazard"></i><p  class="pwestuhan">`+filtered[x].country+`</p><p class="caseCount">Count: `+filtered[x].latest+`</p></div>`;
            }else{
                locations += `<div class="locations"  data-toggle="modal" data-target="#myModal" onclick="renderChart(`+ x +`)"><i class="fas fa-biohazard"></i><p  class="pwestuhan">`+filtered[x].province+", "+filtered[x].country+`</p><p class="caseCount">Count: `+filtered[x].latest+`</p></div>`;
            }
        }
        
    } 
    if(inputValue == ''){
        for(x = 0; x!= coronaV.locations.length;x++){
        // console.log(covid.locations[x].province);
            if(coronaV.locations[x].province == ""){
                locations += `<div class="locations"  data-toggle="modal" data-target="#myModal" onclick="renderChart(`+ x +`)"><i class="fas fa-biohazard"></i><p  class="pwestuhan">`+coronaV.locations[x].country+`</p><p class="caseCount">Count: `+coronaV.locations[x].latest+`</p></div>`;
            }else{
                locations += `<div class="locations"  data-toggle="modal" data-target="#myModal" onclick="renderChart(`+ x +`)"><i class="fas fa-biohazard"></i><p  class="pwestuhan">`+coronaV.locations[x].province+", "+coronaV.locations[x].country+`</p><p class="caseCount">Count: `+coronaV.locations[x].latest+`</p>></div>`;
            }
        }
    }
    $("#locationContainer").html("")
    $(".locationContainer").html(locations);
}
function renderChart(arrayNumber){
    var arrs = []
    var arrss = []
    var newarr = [];
    for(g=0;g!= 59; g++){
        newarr.push('rgba(255, 99, 132, 0.2)')
    }
    function compare(a,b){
        const dateA = new Date(a.date) //first i sort the array of 59 date and number, because on the api, the date is unorganized.
        const dateB = new Date(b.date)
        let comparison = 0;

        if(dateA > dateB){
            comparison = -1;
        }else if(dateA < dateB){
            comparison = 1;
        }
        return comparison * -1;
    }
    result[arrayNumber].sort(compare)
    
    // Outputs : [ [1,2,3] , [4,5,6] ,[7,8] ]
    result[arrayNumber].forEach(function(element) { //this is where i render the chart based on which country button is clicked
        arrs.push(element.date) //this is where i generate the date into seperate array
        arrss.push(element.number); // and seperete array for numbers aswell to be brought to the data and label of chartJS
        var ctxLine = document.getElementById("historyChart").getContext("2d");
        if(window.bar != undefined) 
        window.bar.destroy(); 
        window.bar = new Chart(ctxLine, {
            type: 'bar',
            data: {
                labels: arrs,
                datasets: [{
                    label: '# of Confirmed Cases',
                    data: arrss,
                    backgroundColor: newarr,
                    borderColor: newarr,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        
        });
        
    })
}