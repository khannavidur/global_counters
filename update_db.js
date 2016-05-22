var
    MYSQL               = require('mysql'),
    CONNECTION          = MYSQL.createConnection({
        host            : 'localhost',
        user            : 'root',
        password        : '',
        database        : 'counter_engine'
    }),
    INCREMENTER         = "1",
    QUERY               = "update counters set value = value+" + INCREMENTER;

CONNECTION.connect();

(function(){

    function start(cb){
        return cb();
    }


    var callback = function(){
        setTimeout(function(){
            CONNECTION.query(QUERY, function(err, rows, fields){
                if (err) {
                    console.log("error - updating the table");
                } else{
                    console.log('updated');
                }

                start(callback);      
            });
        },1000);
    };

    start(callback);
})();