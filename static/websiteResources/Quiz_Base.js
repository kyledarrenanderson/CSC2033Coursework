    var mydata = JSON.parse(data);
    function Easy(){
        for (let i = 0; i <mydata.length; i++) {
            if (mydata[i].Difficulty === "Easy") {
                document.write(mydata[i].question)
                document.write("<br>")
            }
        }
    }
    function Normal(){
        for (let i = 0; i <mydata.length; i++) {
            if (mydata[i].Difficulty === "Normal") {
                document.write(mydata[i].question)
                document.write("<br>")
            }
        }
    }
    function Hard() {
        for (let i = 0; i <mydata.length; i++) {
            if (mydata[i].Difficulty === "Hard") {
                document.write(mydata[i].question)
                document.write("<br>")
            }
        }
    }