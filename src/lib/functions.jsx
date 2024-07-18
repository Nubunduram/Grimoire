/* eslint-disable react/jsx-props-no-spreading */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import React from 'react';
import styles from '../components/Books/BookItem/BookItem.module.css';

// eslint-disable-next-line import/prefer-default-export
export function displayStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    if (i < Math.round(rating)) {
      stars.unshift(<FontAwesomeIcon key={`full-${i}`} icon={solid('star')} className={styles.full} />);
    } else {
      stars.unshift(<FontAwesomeIcon key={`empty-${i}`} icon={solid('star')} className={styles.empty} />);
    }
  }
  return stars;
}
export function generateStarsInputs(rating, register, readOnly = false) {
  const stars = [];
  for (let i = 5; i > 0; i -= 1) {
    const starIndex = 6 - i;
    if (rating > 0 && starIndex <= Math.round(rating)) {
      stars.unshift(readOnly ? <FontAwesomeIcon key={`full-${starIndex}`} icon={solid('star')} className={styles.full} /> : (
        <label key={`full-${starIndex}`} htmlFor={`rating${starIndex}`}>
          <FontAwesomeIcon icon={solid('star')} className={styles.full} />
          <input type="radio" value={starIndex} id={`rating${starIndex}`} {...register('rating')} readOnly={readOnly} />
        </label>
      ));
    } else {
      stars.unshift(readOnly ? <FontAwesomeIcon key={`full-${starIndex}`} icon={solid('star')} className={styles.empty} /> : (
        <label key={`full-${starIndex}`} htmlFor={`rating${starIndex}`}>
          <FontAwesomeIcon icon={solid('star')} className={styles.empty} />
          <input type="radio" value={starIndex} id={`rating${starIndex}`} {...register('rating')} />
        </label>
      ));
    }
  }
  return stars;
}
