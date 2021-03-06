import { UserProfile } from './types';
import { uniqueNamesGenerator, animals } from 'unique-names-generator';
import { v4 } from 'uuid';

export const getGuestAccount = (): UserProfile => {
  const guestAccount = localStorage.getItem('guest');
  if (guestAccount) {
    const guest = JSON.parse(guestAccount);
    return {
      id: guest.id,
      name: guest.name,
      photo: `https://avatars.dicebear.com/api/gridy/${guest.id}.svg`,
      isGuest: true,
    };
  }

  // create new guest credentials
  const newId = v4();
  const guest = {
    id: newId,
    name: uniqueNamesGenerator({
      dictionaries: [['Anonymous'], animals],
      length: 2,
      separator: ' ',
      style: 'capital',
    }),
    photo: `https://avatars.dicebear.com/api/gridy/${newId}.svg`,
    isGuest: true,
  };
  localStorage.setItem(
    'guest',
    JSON.stringify({ id: guest.id, name: guest.name })
  );
  return guest;
};

export const parseSecondsToDuration = (timeInSeconds: number) => {
  const dateObj = new Date(timeInSeconds * 1000);
  const hours = dateObj.getUTCHours().toString();
  const minutes = dateObj.getUTCMinutes().toString();
  const seconds = dateObj.getSeconds().toString();

  return (
    hours.padStart(2, '0') +
    ':' +
    minutes.padStart(2, '0') +
    ':' +
    seconds.padStart(2, '0')
  );
};
