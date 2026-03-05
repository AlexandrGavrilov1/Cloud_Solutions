import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

const VISITOR_COOKIE_NAME = 'visitor_id';
const COOKIE_EXPIRY_DAYS = 365;

export const useVisitor = (): string | undefined => {
  const [visitorId, setVisitorId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Пытаемся получить существующий ID из куки
    let storedId = Cookies.get(VISITOR_COOKIE_NAME);
    if (!storedId) {
      // Если нет – генерируем новый
      storedId = uuidv4();
      Cookies.set(VISITOR_COOKIE_NAME, storedId, { expires: COOKIE_EXPIRY_DAYS });
    }
    setVisitorId(storedId);
  }, []);

  return visitorId;
};
