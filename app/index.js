const axios = require("axios");
const express = require("express");
const path = require("path");

//Get location
const getLocation = async (location) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1Ijoic2FuZ3R1cnRsZTMiLCJhIjoiY2xpZ3pjYmUwMWkxbjNjczF1OXBsZjJibSJ9.o4WusjpPX-jj7ToJJqAuzQ`
    let result = await axios.get(url)
    .then(res => {
        if (res.data && res.data.features.length != 0) {
            return {
                status: true,
                data: res.data.features[0]
            }
        }else{
            return {
                status: false,
                comment: "Không tìm thấy"                
            }
        }
    })
    .catch(err => {
        return {
            status: false,
            comment:"Không thể tìm",
            err
        }
    });
    console.log(result);
    return result
}

// getLocation("Mỹ Tho");

//Set up local host
const app = express();
const port = 5000;

//setup static file
const pathPublic = path.join(__dirname, "../public")
app.use(express.static(pathPublic));

//Set view engine
app.set("view engine", "hbs");


// http://localhost5000/img/husky.jpg
app.get("/", async (req, res) => {
    const param = req.query;
    const adr = param.address;
    console.log(adr);
    if (adr) {
        const result = await getLocation(adr);
        if (result.status) {
            res.render("position", {
                status: true,
                name: result.data.place_name,
                latitude: result.data.center[1],
                longitude: result.data.center[0]
            })
        }else{
            res.render("position", {
                status: false,
                comment: result.comment
            })
        }
    } else {
        res.render("position", {
            status: false
        })
    }

})
app.listen(port, () => {
    console.log(`app run on port ${port}`);
})


