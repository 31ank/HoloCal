<?php
    require 'database.php';

    if($_GET['entries'] == "curweek"){

        $query =$pdo->prepare("SELECT * FROM streams JOIN members ON members.id = streams.member_id");
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