<?php
    require 'database.php';

    class streamEntries {
        public function __construct($member, $streamName, $streamDate, $streamURL, $channelURL) {
            $this->member = $member;
            $this->streamName = $streamName;
            $this->streamDate = $streamDate;
            $this->streamURL = $streamURL;
            $this->channelURL = $channelURL;
        }
    }

    $regex = '/^\+[0-9]{2}:[0-9]{2}$/';
    $regex2 = '/^-[0-9]{2}:[0-9]{2}$/';

    if($_GET['week'] == "this"){
        $newTimezone = $_GET['timezone'];
        if (strpos($_GET['timezone'],'\\') !== false) {
            $newTimezone = str_replace('\\', '+', $_GET['timezone']);
        }
        if($_GET['timezone'] != null){
            if(preg_match($regex, $newTimezone) || preg_match($regex2, $newTimezone)){
                $query =$pdo->prepare("SELECT first_name, last_name, stream_name, ch_url, CONVERT_TZ(stream_date,'+00:00','".$newTimezone."') AS stream_date FROM streams JOIN members ON members.id = streams.member_id WHERE YEARWEEK(`stream_date`, 1) = YEARWEEK(CURDATE(), 1)");
            } else {
                http_response_code(400);
                echo json_encode(array('error' => 'Timeformat wrong'));
                return;
            }
        } else {
            $query =$pdo->prepare("SELECT * FROM streams JOIN members ON members.id = streams.member_id WHERE YEARWEEK(`stream_date`, 1) = YEARWEEK(CURDATE(), 1)");
        }

        $query->execute();
    
        $streams = array();
    
        while($row = $query->fetch()) {
            array_push($streams, new streamEntries($row['first_name']." ".$row["last_name"], $row['stream_name'], $row['stream_date'], $row["ch_url"], $row["ch_url"]));
        }

        http_response_code(200);
        echo json_encode($streams);
    } else if($_GET['week'] == "next"){
        http_response_code(501);
        echo json_encode(array('error' => 'Still in development'));
    } else if($_GET['week'] == "last"){
        http_response_code(501);
        echo json_encode(array('error' => 'Still in development'));        
    }else {
        http_response_code(400);
        echo json_encode(array('error' => 'Wrong format'));
    }
?>