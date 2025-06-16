import { MdFavoriteBorder, MdOutlineFavorite } from "react-icons/md";

import styles from "./page.module.css";

interface CountryCardProps {
  name: string;
  flag: string;
  favorite: boolean;
  handleFavorite: () => void;
}

export default function CountryCard(props: CountryCardProps) {
  const { name, flag, favorite, handleFavorite } = props;

  return (
    <li className={`${styles.container} ${favorite ? styles.favorite : ""}`}>
      <img src={flag} alt={name} />
      <h5>{name}</h5>

      <div
        onClick={handleFavorite}
        className={
          favorite ? styles.favoriteShow : styles.favoriteShowOnlyOnHover
        }
      >
        {favorite ? <MdOutlineFavorite /> : <MdFavoriteBorder />}
      </div>
    </li>
  );
}
