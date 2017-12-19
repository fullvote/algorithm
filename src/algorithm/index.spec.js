const getWinner = require('./index').getWinner;

describe('No ballots', () => {
  test('1', () => {
    expect(getWinner([])).toEqual({
      names: [],
      reason: 'no ballets',
      success: false,
      total: 0
    });
  });
  test('2', () => {
    expect(getWinner()).toEqual({
      names: [],
      reason: 'no ballets',
      success: false,
      total: 0
    });
  });
});

describe('Ties:', () => {

  describe('simple tie (backward compatible with standard voting methodology)', () => {
    test('1', () => {
      expect(getWinner([
        ['rubio'],
        ['cruz'],
      ])).toEqual({
        success: true,
        names: ['cruz', 'rubio'],
        received: 1,
        total: 2,
        percentage: 50.00
      });
    });
    test('2', () => {
      expect(getWinner([
        ['rubio'],
        ['cruz'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['clinton', 'cruz', 'rubio'],
        received: 1,
        total: 3,
        percentage: 33.33
      });
    });
  });

  describe('fallback vote doesn\'t mistakenly get the vote for the tie', () => {
    test('1', () => {
      expect(getWinner([
        ['rubio'],
        ['cruz'],
        ['clinton', 'bush']
      ])).toEqual({
        success: true,
        names: ['clinton', 'cruz', 'rubio'],
        received: 1,
        total: 3,
        percentage: 33.33
      });
    });
  });

  describe('more advanced forms of ties', () => {

    // A fallback vote should not cost your candidate their chance to win (tie)
    test('1', () => {
      expect(getWinner([
        ['rubio'],
        ['cruz'],
        ['clinton', 'cruz']
      ])).toEqual({
        success: true,
        names: ['clinton', 'cruz', 'rubio'],
        received: 1,
        total: 3,
        percentage: 33.33
      });
    });

    test('2', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['cruz', 'rubio'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['cruz', 'rubio'],
        received: 2,
        total: 3,
        percentage: 66.67
      });
    });

    test('3', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['cruz', 'rubio'],
        ['clinton'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['clinton', 'cruz', 'rubio'],
        received: 2,
        total: 4,
        percentage: 50.00
      });
    });

    test('4.0', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['rubio', 'cruz'],
        ['cruz', 'rubio'],
        ['clinton'],
        ['clinton'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['clinton', 'rubio'],
        received: 3,
        total: 6,
        percentage: 50.00
      });
    });
    test('4.1', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['rubio', 'cruz'],
        ['cruz', 'rubio'],
        ['clinton'],
        ['clinton'],
        ['sanders', 'clinton']
      ])).toEqual({
        success: true,
        names: ['clinton', 'rubio'],
        received: 3,
        total: 6,
        percentage: 50.00
      });
    });
    test('4.2', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['rubio', 'cruz'],
        ['cruz', 'rubio'],
        ['clinton'],
        ['clinton'],
        ['clinton', 'cruz']
      ])).toEqual({
        success: true,
        names: ['clinton', 'rubio'],
        received: 3,
        total: 6,
        percentage: 50.00
      });
    });
    test('4.3', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['rubio', 'cruz'],
        ['cruz', 'rubio'],
        ['clinton'],
        ['clinton'],
        ['clinton', 'rubio']
      ])).toEqual({
        success: true,
        names: ['clinton', 'rubio'],
        received: 3,
        total: 6,
        percentage: 50.00
      });
    });

    test('5', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['cruz', 'clinton'],
        ['clinton', 'rubio'],
      ])).toEqual({
        success: true,
        names: ['clinton', 'cruz', 'rubio'],
        received: 2,
        total: 3,
        percentage: 66.67
      });
    });
  });

  describe('tie showing: not weighted ranks, but true vote', () => {
    // Not weighted ranking. True votes.
    test('1', () => {
      expect(getWinner([
        ['rubio'],
        ['cruz', 'rubio'],
        ['clinton'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['clinton', 'rubio'],
        received: 2,
        total: 4,
        percentage: 50.00
      });
    });
  });

  describe('two way tie handled correctly (not take into account fallback)', () => {
    // Fallback vote should not cost your candidate their chance to win (tie)
    test('1', () => {
      expect(getWinner([
        ['rubio'],
        ['rubio'],
        ['cruz', 'rubio'],
        ['cruz'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['cruz', 'rubio'],
        received: 2,
        total: 5,
        percentage: 40.00
      });
    });

    test('2', () => {
      expect(getWinner([
        ['rubio', 'bush'],
        ['rubio', 'bush'],
        ['rubio', 'bush'],
        ['trump', 'bush'],
        ['trump', 'bush'],
        ['trump', 'bush'],
        ['bush'],
      ])).toEqual({
        success: true,
        names: ['rubio', 'trump'],
        received: 3,
        total: 7,
        percentage: 42.86
      });
    });

    test('3', () => {
      expect(getWinner([
        ['rubio', 'bush'],
        ['rubio', 'bush'],
        ['rubio', 'bush'],
        ['trump', 'rubio'],
        ['trump', 'rubio'],
        ['trump', 'rubio'],
        ['bush'],
      ])).toEqual({
        success: true,
        names: ['rubio', 'trump'],
        received: 3,
        total: 7,
        percentage: 42.86
      });
    });
  });

  describe('another', () => {
    // Not weighted ranking (wherein clinton would win). True votes.
    test('1', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['kasich', 'rubio'],
        ['clinton'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['clinton', 'rubio'],
        received: 2,
        total: 4,
        percentage: 50.00
      });
    });
  });

  describe('advanced', () => {
    // A fallback vote should not cost your candidate their chance to win (tie)
    // Closest this algorithm comes to "splitting" the vote - carson
    // would have won (with no tiers, and a larger majority) if trump had
    // not been a candidate. But those folks canidate still "won" (via tie).
    // Because trump had a chance of winning (tieing), his fallback votes must
    // not be factored in.
    // "It's not splitting the vote if you 'win'"
    test('1', () => {
      expect(getWinner([
        ['rubio'],
        ['rubio'],
        ['rubio'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['carson'],
        ['carson']
      ])).toEqual({
        success: true,
        names: ['rubio', 'trump'],
        received: 3,
        total: 8,
        percentage: 37.50
      });
    });

    // Below example is INCORRECT.
    /*
      rubio    bush    bush    trump   trump   trump   carson    carson
      carson   rubio   rubio   carson  carson  carson  rubio     trump
      -----------------------------------------------------------------

      rubio    bush    bush    TRUMP   TRUMP   TRUMP   carson    carson
      carson   rubio   rubio   carson  carson  carson  rubio     trump

      RUBIO    bush    bush    trump   trump   trump   carson    carson
      carson   RUBIO   RUBIO   carson  carson  carson  RUBIO     trump

      rubio    bush    bush    trump   trump   trump   CARSON    CARSON
      carson   rubio   rubio   CARSON  CARSON  CARSON  rubio     trump

      (Interestingly, Carson doesn't get the vote from the first person,
      since Rubio is the leader at that point)
    */

    // Below is CORRECT:
    /*
      rubio    bush    bush    trump   trump   trump   carson    carson
      carson   rubio   rubio   carson  carson  carson  rubio     trump
      -----------------------------------------------------------------

      rubio    bush    bush    TRUMP   TRUMP   TRUMP   carson    carson
      carson   rubio   rubio   carson  carson  carson  rubio     trump

      RUBIO    bush    bush    trump   trump   trump   carson    carson
      carson   RUBIO   RUBIO   carson  carson  carson  RUBIO     trump

      RUBIO    bush    bush    TRUMP   TRUMP   TRUMP   carson    carson
      carson   RUBIO   RUBIO   carson  carson  carson  RUBIO     TRUMP
    */
    test('2', () => {
      expect(getWinner([
        ['rubio', 'carson'],
        ['bush', 'rubio'],
        ['bush', 'rubio'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['carson', 'rubio'],
        ['carson', 'trump']
      ])).toEqual({
        success: true,
        names: ['rubio', 'trump'],
        received: 4,
        total: 8,
        percentage: 50.00
        // names: ['carson'],
        // received: 5,
        // total: 8,
        // percentage: 62.50
      });
    });
  });
});

describe('Winning:', () => {
  describe('winning with minority (backward compatible with standard voting metholodogy)', () => {
    test('1', () => {
      expect(getWinner([
        ['rubio'],
        ['rubio'],
        ['cruz'],
        ['kasich'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['rubio'],
        received: 2,
        total: 5,
        percentage: 40.00
      });
    });
  });

  describe('winning with majority (backward compatible with standard voting metholodogy)', () => {
    test('1', () => {
      expect(getWinner([
        ['rubio'],
        ['rubio'],
        ['rubio'],
        ['kasich'],
        ['clinton']
      ])).toEqual({
        success: true,
        names: ['rubio'],
        received: 3,
        total: 5,
        percentage: 60.00
      });
    });
  });

  describe('successful fallback', () => {
    test('1', () => {
      // No sense of "weighted" (bush has more "weighted" 1st place points)
      // than rubio. Rather, each ballot is a true vote. Bush can't win,
      // but rubio can, so the votes go to rubio.
      expect(getWinner([
          ['rubio'],
          ['rubio'],
          ['bush', 'rubio'],
          ['bush', 'rubio'],
          ['bush', 'rubio'],
          ['trump'],
          ['trump'],
          ['trump'],
          ['trump']
      ])).toEqual({
        success: true,
        names: ['rubio'],
        received: 5,
        total: 9,
        percentage: 55.56
      });
    });
  });

  describe('respects order - fallbacks only used from losing votes; MAJORITY', () => {
    // Respecting the order of votes, fallbacks are only used when the
    // vote would otherwise lose (be wasted).
    test('1', () => {
      expect(getWinner([
        ['rubio', 'cruz'],
        ['cruz'],
        ['kasich'],
        ['kasich'],
        ['kasich', 'cruz']
      ])).toEqual({
        success: true,
        names: ['kasich'],
        received: 3,
        total: 5,
        percentage: 60.00
      });
    });

    // Notice: Rubio does not win because fallbacks
    // are only evaulated from the losing voters' ballots.
    test('1', () => {
      expect(getWinner([
        ['kasich', 'rubio'],
        ['kasich', 'rubio'],
        ['rubio'],
        ['bush', 'rubio'],
        ['kasich', 'rubio', 'bush'],
        ['trump'],
        ['bush', 'rubio'],
        ['kasich', 'rubio'],
        ['trump'],
        ['kasich', 'rubio', 'bush'],
        ['kasich', 'rubio', 'bush']
      ])).toEqual({
        success: true,
        names: ['kasich'],
        received: 6,
        total: 11,
        percentage: 54.55
      });
    });
  });

  describe('respects order - fallbacks only used from losing votes; EVEN IN MINORITY', () => {
    // Would early flip instead of win if algorithm wrong
    test('1', () => {
      expect(getWinner([
        ['cruz'],
        ['cruz'],
        ['kasich', 'cruz'],
        ['kasich'],
        ['kasich'],
        ['bush'],
        ['bush']
      ])).toEqual({
        success: true,
        names: ['kasich'],
        received: 3,
        total: 7,
        percentage: 42.86
      });
    });

    // Would early flip if algorithm wrong
    test('2', () => {
      expect(getWinner([
        ['cruz'],
        ['cruz'],
        ['kasich', 'cruz'],
        ['kasich'],
        ['kasich'],
        ['bush'],
      ])).toEqual({
        success: true,
        names: ['kasich'],
        received: 3,
        total: 6,
        percentage: 50.00
      });
    });

    // Notice: Rubio does not win because fallbacks
    // are only evaulated from losing voters' ballots.
    test('3', () => {
      expect(getWinner([
        ['rubio'],
        ['bush', 'rubio'],
        ['kasich', 'rubio', 'bush'],
        ['trump'],
        ['bush', 'rubio'],
        ['kasich', 'rubio'],
        ['trump'],
        ['kasich', 'rubio', 'bush'],
        ['kasich', 'rubio', 'bush']
      ])).toEqual({
        success: true,
        names: ['kasich'],
        received: 4,
        total: 9,
        percentage: 44.44
      });
    });

    // Notice: In the second round, carson was not chosen because fallbacks
    // are only evaluated from losing voters' ballots.
    test('4', () => {
      expect(getWinner([
        ['cruz'],
        ['rubio', 'carson'],
        ['bush', 'cruz'],
        ['bush', 'rubio'],
        ['bush', 'rubio'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['carson', 'trump'],
        ['carson', 'trump']
      ])).toEqual({
        success: true,
        names: ['trump'],
        received: 6,
        total: 11,
        percentage: 54.55
      });
    });


    // Trump has majority of votes outright, so there was no need to recurse
    // through. Doing so (as is shown in the next test) would result in him
    // getting all 6 votes.
    // Todo: do we want to examine ballots in `main` (the wrapper function
    // for which is exposed as `getWinner`) to account for this?
    test('5', () => {
      expect(getWinner([
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['carson', 'trump'],
        ['carson', 'trump']
      ])).toEqual({
        success: true,
        names: ['trump'],
        received: 4,
        total: 6,
        percentage: 66.67
      });
    });
    // cf test above
    // Ensures get "trueLeader"
    test('6', () => {
      expect(getWinner([
        ['a'],
        ['a'],
        ['a'],
        ['a'],
        ['a'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['carson', 'trump'],
        ['carson', 'trump']
      ])).toEqual({
        success: true,
        names: ['trump'],
        received: 6,
        total: 11,
        percentage: 54.55
      });
    });


    // Trump is winning in first round with 4.
    // Carson does not beat him because fallbacks only counted from loser.
    // However, Rubio does beat him in the second round (with 5).
    // This could mistakenly "free up" the trump/carson votes to be either
    // order in the quest to try to beat rubio.
    //
    // Ensures logic of `getTrueWinners`
    test('7', () => {
      expect(getWinner([
        ['rubio'],
        ['rubio', 'carson'],
        ['bush', 'rubio'],
        ['bush', 'rubio'],
        ['bush', 'rubio'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['carson', 'trump'],
        ['carson', 'trump']
      ])).toEqual({
        success: true,
        names: ['trump'],
        received: 6,
        total: 11,
        percentage: 54.55
      });
    });
  });


  describe('advanced', () => {

    test('1', () => {
      expect(getWinner([
        ['rubio', 'carson'],
        ['bush', 'rubio'],
        ['bush', 'rubio'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['carson', 'rubio'],
        ['carson', 'trump'],
        ['cruz', 'carson']
      ])).toEqual({
        success: true,
        names: ['carson'],
        received: 5, // todo seems like it should be more
        total: 9,
        percentage: 55.56
      });
    });

    test('2', () => {
      expect(getWinner([
        ['rubio', 'carson'],
        ['rubio'],
        ['rubio'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['trump', 'carson'],
        ['carson', 'rubio'],
        ['carson'],
        ['carson'],
      ])).toEqual({
        success: true,
        names: ['carson'],
        received: 5, // todo seems like it should be more
        total: 9,
        percentage: 55.56
      });
    });
  });
});
