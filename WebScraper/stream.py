class StreamEntry:
    streamer = ""
    streamDate = ""
    streamName = ""

    def __init__(self, streamer, streamDate, streamName = "Missing information"):
        self.streamer = streamer
        self.streamDate = streamDate
        self.streamName = streamName

    def __str__(self):
        return "Name: " + self.streamer + " Date: " + self.streamDate + " Streamname: " + self.streamName

    def __eq__(self, other):
        return self.streamer + self.streamDate + self.streamName == other.streamer + other.streamDate + other.streamName