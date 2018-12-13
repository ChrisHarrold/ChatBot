var s_score = msg.sentiment.score;
var str_t_text = msg.tweet.text;
var tag_count = 0;

msg1 = msg;
msg2 = msg;
msg3 = msg;

msg2.NoTags = "False";
msg2.Vendor = "False";
msg2.tagged = "False";
msg2.WebLink = "True";

msg3.retweet = "False";

if (s_score >= 0){

    if (str_t_text.indexOf("RT") > -1){
        msg3.retweet = "True";
        return [null, null, msg3];
    } 

    if (str_t_text.indexOf("#IoT") == -1){
        tag_count = tag_count + 1;
    }
    if (str_t_text.indexOf("#IIoT") == -1){
        tag_count = tag_count + 1;
    }
    if (str_t_text.indexOf("#IOT") == -1){
        tag_count = tag_count + 1;
    }
    if (str_t_text.indexOf("#iot") == -1){
        tag_count = tag_count + 1;
    }

    if (tag_count == 4 ) {
        msg2.NoTags = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("@") > -1){
        msg2.tagged = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("IBM") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("ibm") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("Azure") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("azure") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("google") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("Google") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("aws") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("AWS") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("amazon") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("Amazon") > -1){
        msg2.Vendor = "True";
        return [null, msg2, null];
    } else if (str_t_text.indexOf("http") == -1){
        msg2.WebLink = "False";
        return [null, msg2, null];
    } else {
        return [msg1, null];
    }
}
