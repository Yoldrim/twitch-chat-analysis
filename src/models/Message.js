class Message {
  static SQL_TABLE_COLUMNS = 'ExternalId TEXT NOT NULL,' +

    'RoomId INTEGER NOT NULL, ' +

    'UserId INTEGER NOT NULL, ' +
    'UserName TEXT NOT NULL, ' +
    'UserDisplayName TEXT NOT NULL, ' +
    'UserSubscriber INTEGER NOT NULL, ' +

    'SentimentScore INTEGER NOT NULL, ' +
    'SentimentComparative INTEGER NOT NULL, ' +

    'UserColor CHAR(7), ' +       // CAN BE NULL
    'SentimentPositive TEXT, ' +  // CAN BE NULL
    'SentimentNegative TEXT, ' +  // CAN BE NULL

    'Text TEXT NOT NULL';

  externalId            = undefined;

  roomId                = undefined;

  userId                = undefined;
  userName              = undefined;
  userDisplayName       = undefined;
  userColor             = undefined;
  userSubscriber        = undefined;

  sentimentScore        = undefined;
  sentimentComparative  = undefined;
  sentimentPositive     = undefined;
  sentimentNegative     = undefined;

  text                  = undefined;

  constructor(externalId, roomId, userId, userName, userDisplayName, userColor, userSubscriber, sentimentScore, sentimentComparative, sentimentPositive, sentimentNegative, text) {
    this.externalId           = externalId;

    this.roomId               = roomId;

    this.userId               = userId;
    this.userName             = userName;
    this.userDisplayName      = userDisplayName;
    this.userSubscriber       = userSubscriber;

    this.sentimentScore       = sentimentScore;
    this.sentimentComparative = sentimentComparative;

    this.text                 = text;

    this.userColor            = userColor;
    this.sentimentPositive    = sentimentPositive;
    this.sentimentNegative    = sentimentNegative;
  }

  // This function is a mess, needs to be improved somehow
  toSqlWithValues = () => {
    const { externalId, roomId, userId, userName, userDisplayName, userSubscriber, sentimentScore, sentimentComparative, text, userColor, sentimentPositive, sentimentNegative } = this.toJson();

    const userSub = userSubscriber ? 1 : 0;
    const sentPosStr = sentimentPositive.join(',');
    const sentNegStr = sentimentNegative.join(',');

    const optionalVariables = `${userColor ? ', UserColor' : ''}${sentPosStr ? ', SentimentPositive' : ''}${sentNegStr ? ', SentimentNegative' : ''}`;
    const optionalValues    = `${userColor ? `, '${userColor}'` : ''}${sentPosStr ? `, '${sentPosStr}'` : ''}${sentNegStr ? `, '${sentNegStr}'` : ''}`;

    return `(ExternalId, RoomId, UserId, UserName, UserDisplayName, UserSubscriber, SentimentScore, SentimentComparative, Text${optionalVariables}) ` +
           `Values('${externalId}', ${roomId}, ${userId}, '${userName}', '${userDisplayName}', ${userSub}, ${sentimentScore}, ${sentimentComparative}, '${text}'${optionalValues})`;
  };

  toJson = () => (
    {
      externalId:           this.externalId,

      roomId:               this.roomId,

      userId:               this.userId,
      userName:             this.userName,
      userDisplayName:      this.userDisplayName,
      userSubscriber:       this.userSubscriber,

      sentimentScore:       this.sentimentScore,
      sentimentComparative: this.sentimentComparative,

      text:                 this.text,

      userColor:            this.userColor,
      sentimentPositive:    this.sentimentPositive,
      sentimentNegative:    this.sentimentNegative,
    }
  );

  // Make sure all variables that are NOT NULL are not undefined, this should always be done before persisting
  validate = () => {
    return this.externalId      !== undefined &&
      this.roomId               !== undefined &&
      this.userId               !== undefined &&
      this.userName             !== undefined &&
      this.userDisplayName      !== undefined &&
      this.userSubscriber       !== undefined &&
      this.sentimentScore       !== undefined &&
      this.sentimentComparative !== undefined
  };
}

module.exports = Message;
