var s_score = msg.sentiment.score;
var str_t_text = msg.tweet.text;

// output 1 is the bin - nothing survives this or is reused
msg1 = msg;
msg1.LowScore = 0;
msg1.HardBan = 0;
msg1.NoTags = 0;
var tag_count = 0;

// output 2 is the happy path and results in que for retweet
msg2 = msg;
msg2.Clean = 1;

// output 3 feeds the recycler function which strips and grooms for "original" tweets
msg3 = msg;
msg3.Vendor = 0;
msg3.WebLink = 1;

// output 4 is for retweets. currently they are just logged. They could be scrubbed possibly, but requires extreme
// care as they are likely tagged with other people
msg4 = msg;
msg4.Retweet = 0;
msg4.Tagged = 0;

// check the sentiment score first - we only want neutral or positive messages (nothing that says the topic is bad!)
// negative tweets are not returned - they are dropped, but logged and can be routed by catching them later from msg1
if (s_score >= 0){
    
    // check if the tweet is tagged with the keyword(s) and variations of the keyword(s) as definied in the twitter node
    // add to the "tags counter" value so that if there are 0 tags at the end we know it is not a valid tweet
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

    // Check the counter and if it equals the number of tags we are looking for, bin the tweet as not relevant
    // these could get reprocessed later, but in this iteration they just go to the bit bucket
    // NOTE - this seems redundant, but I found MANY tweets without the search terms in designing this - if you
    // ommit this, you will get tweets without the keywords in the stream. Highly recommend doing this.
    if (tag_count == 4 ) {
        msg1.NoTags = 1;
    }
    // check for "Hard Bans" - these are words we definitely NEVER want to retweet or show up in our feed in any way
    // these messages are fully discarded
    if (str_t_text.indexOf("IBM") > -1){
        msg1.HardBan = 1;
    } else if (str_t_text.indexOf("ibm") > -1){
        msg1.HardBan = 1;
    } else if (str_t_text.indexOf("blockchain") > -1){
        msg1.HardBan = 1;
    } else if (str_t_text.indexOf("Blockchain") > -1){
        msg1.HardBan = 1;
    }
    // Now parse for a variety of keywords - essentially anything we do or don't want to tweet out
    // Recommend at a minimum to check for vendors so you are not tagging people and companies in the RT
    // These messages are recycled for "original" content via the tweet-scrubber/recycler function later
    
    if (str_t_text.indexOf("Azure") > -1){
        msg3.Vendor = 1;
    } else if (str_t_text.indexOf("azure") > -1){
        msg3.Vendor = 1;
    } else if (str_t_text.indexOf("google") > -1){
        msg3.Vendor = 1;
    } else if (str_t_text.indexOf("Google") > -1){
        msg3.Vendor = 1;
    } else if (str_t_text.indexOf("aws") > -1){
        msg3.Vendor = 1;
    } else if (str_t_text.indexOf("AWS") > -1){
        msg3.Vendor = 1;
    } else if (str_t_text.indexOf("amazon") > -1){
        msg3.Vendor = 1;
    } else if (str_t_text.indexOf("Amazon") > -1){
        msg3.Vendor = 1;
    }
    
    // is there a link present in the orginal? - not required per-se, but tweets with real
    // content perform better, so we want to prioritize tweets which have a link. No links will get
    // sent to the scrubber/recycler
    if (str_t_text.indexOf("http") == -1){
        msg3.WebLink = 0;
    }
    
    // Check if the tweet is a retweet already - if so, send to the retweeted bin for future processing
    if (str_t_text.indexOf("RT") > -1){
        msg4.Retweet = 1;
        
    //check for anyone being tagged in the tweet?
    } else if (str_t_text.indexOf("@") > -1){
        msg4.Tagged = 1;
    }

}

if ((msg1.LowScore == 1) || (msg1.HardBan ==1) || (msg1.NoTags == 1)) {
    msg1.ISENTTHIS = "Yep";
    return [msg1, null, null, null];

} else if ((msg3.Vendor == 1) || (msg3.WebLink === 0)){
    return [null, null, msg3, null];

} else if ((msg4.Tagged == 1) || (msg4.Retweet == 1)){
    return [null, null, null, msg4];

} else {
    return [null, msg2, null, null];
} 