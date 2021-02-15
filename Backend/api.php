<?php
    require 'database.php';

    if($_GET['entries'] == "curweek"){
        $newTimezone = $_GET['timezone'];
        if (strpos($_GET['timezone'],'\\') !== false) { //first we check if the url contains the string 'en-us'
            $newTimezone = str_replace('\\', '+', $_GET['timezone']); //if yes, we simply replace it with en
        }
        if($_GET['timezone'] != null){
            $query =$pdo->prepare("SELECT first_name, last_name, stream_name, stream_time, ch_url, CONVERT_TZ(stream_date,'+00:00','".$newTimezone."') AS stream_date FROM streams JOIN members ON members.id = streams.member_id");
        } else {
            $query =$pdo->prepare("SELECT * FROM streams JOIN members ON members.id = streams.member_id");
        }
        $query->execute();
    
    
        class streamEntries {
            public function __construct($member, $streamName, $streamTime, $streamDate, $streamURL, $channelURL) {
                $this->member = $member;
                $this->streamName = $streamName;
                $this->streamTime = $streamTime;
                $this->streamDate = $streamDate;
                $this->streamURL = $streamURL;
                $this->channelURL = $channelURL;
            }
        }
    
        $streams = array();
    
    
        while($row = $query->fetch()) {
            array_push($streams, new streamEntries($row['first_name']." ".$row["last_name"], $row['stream_name'], $row['stream_time'], $row['stream_date'], $row["ch_url"], $row["ch_url"]));
        }
        echo json_encode($streams);
    } else {
        echo("No API");
    }
?>