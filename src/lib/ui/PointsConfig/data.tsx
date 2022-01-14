export default function useActions() {
  return {
    total: 15,
    current: 1,
    perPage: 5,
    actions: [
      {
        id: '1',
        action: 'Creating your password',
        pointsEarned: 50,
        maxPerDay: 25,
        maxPerEvent: 1,
        minInterval: 100,
      },
      {
        id: '2',
        action: 'Completing check-in',
        pointsEarned: 50,
        maxPerDay: 25,
        maxPerEvent: 1,
        minInterval: 100,
      },
      {
        id: '3',
        action: 'Downloading resource',
        pointsEarned: 50,
        maxPerDay: 25,
        maxPerEvent: 1,
        minInterval: 100,
      },
      {
        id: '4',
        action: 'Joing first call',
        pointsEarned: 50,
        maxPerDay: 25,
        maxPerEvent: 1,
        minInterval: 100,
      },
      {
        id: '5',
        action: 'Sharing on social platform',
        pointsEarned: 50,
        maxPerDay: 25,
        maxPerEvent: 1,
        minInterval: 100,
      },
    ],
  }
}
