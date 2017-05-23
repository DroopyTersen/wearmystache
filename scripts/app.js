var detectFaces = function(imageUrl) {
    var url = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceLandmarks=true&returnFaceAttributes=headPose";
    var headers = { 
        "Ocp-Apim-Subscription-Key": "13c4086c6d354afc92342099ffc1213b",
        "Content-Type": "application/json"
     };
    var body = JSON.stringify({ url: imageUrl });
    return $.ajax({url, method: "POST", headers:headers, data:body })
};

var handleUrlChange = function() {
    var newVal = $("#url-input").val();
    if (newVal) {
        $(".stache-image").remove();
        $("#background-image").attr("src", newVal);
        detectFaces(newVal).then(faces => faces.forEach(f => addStache(f)))
    }
};


var addStache = function(face) {
    console.log(face);
    var imgPosition = $("#background-image").position();
    var stache = $("<img class='stache-image' src='images/stache.png'>")
    var width = (face.faceLandmarks.mouthRight.x - face.faceLandmarks.mouthLeft.x) * 1.7;
    var x = imgPosition.left + face.faceLandmarks.upperLipTop.x - (width / 2)
    var y = face.faceLandmarks.upperLipTop.y - (width / 5);
    stache.css( {
        top: y.toFixed(0) + "px",
        left:  x.toFixed(0) + "px",
        width: width.toFixed(0) + "px",
        transform: `rotate(${face.faceAttributes.headPose.roll.toFixed(0)}deg) rotateY(${(face.faceAttributes.headPose.yaw).toFixed(0)}deg)`
    })
    $("#image-container").append(stache);
};

$("#url-input").on("blur", handleUrlChange);