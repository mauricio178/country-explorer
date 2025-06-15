import { MdOutlineFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";

import styles from "./page.module.css";

interface CountryCardProps {
  name: string;
  flag: string;
  favorite: boolean;
  handleFavorite: () => void;
}

export default function CountryCard(props: CountryCardProps) {
  const { name, flag, favorite, handleFavorite } = props;

  // const handleFavorite = () => {
  //   if (favoriteCountries.includes(name)) {
  //     setFavorite(false);
  //     setFavoriteCountries(favoriteCountries.filter((country) => country !== name));
  //   } else {
  //     setFavorite(true);
  //     setFavoriteCountries([...favoriteCountries, name]);
  //   }
  // };

  return (
    <li className={styles.container}>
      <img src={flag} alt={name} />
      <h1>{name}</h1>

      <div onClick={handleFavorite} className={styles.favorite}>
        {favorite ? <MdOutlineFavorite /> : <MdFavoriteBorder />}
      </div>
    </li>
  );
}
