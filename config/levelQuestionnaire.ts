export type QuestionOption = {
  label: string;
  value: number;
};

export type Question = {
  id: number;
  question: string;
  options: QuestionOption[];
};

export const questionnaire: Question[] = [
  {
    id: 1,
    question: "Coups spécifiques : bandeja, vibora, sortie, par 3/4",
    options: [
      { label: "Je ne les utilise pas encore", value: 1 },
      { label: "J’essaie parfois sans régularité", value: 2 },
      { label: "Je les utilise avec un certain succès", value: 3 },
      { label: "Je les réussis souvent et de manière efficace", value: 4 },
      { label: "Je les maîtrise totalement et les utilise stratégiquement", value: 5 },
    ],
  },
  {
    id: 2,
    question: "Régularité & gestion des échanges",
    options: [
      { label: "Je fais beaucoup de fautes directes", value: 1 },
      { label: "Je peux tenir quelques échanges simples", value: 2 },
      { label: "Je tiens régulièrement l’échange en m’appliquant", value: 3 },
      { label: "Je suis régulier et force souvent la faute adverse", value: 4 },
      { label: "Je suis très solide, je varie et contrôle totalement l’échange", value: 5 },
    ],
  },
  {
    id: 3,
    question: "Comment qualifierais-tu ton niveau de jeu en match ?",
    options: [
      { label: "J’essaie de garder la balle en jeu, je joue surtout pour le fun", value: 1 },
      { label: "Je suis capable de construire les points et je monte parfois au filet", value: 2 },
      { label: "Je maîtrise les schémas classiques, je monte après un lob", value: 3 },
      {
        label: "Je varie les effets, les vitesses, je contre-attaque et smashe régulièrement",
        value: 4,
      },
      {
        label: "Je maîtrise tactiquement tous les coups (vibora, bandeja, doubles vitres...)",
        value: 5,
      },
    ],
  },
  {
    id: 4,
    question: "À quel point ton jeu est structuré et intense ?",
    options: [
      {
        label: "J’essaie de jouer sans faire trop de fautes, mais je manque de régularité",
        value: 1,
      },
      { label: "Mon jeu est structuré, mais pas toujours constant", value: 2 },
      { label: "Mon rythme est bon, je sais quand attaquer ou défendre", value: 3 },
      { label: "Mon jeu est très complet, j’ai des schémas bien définis", value: 4 },
      { label: "Mon jeu est rapide, puissant et exigeant, avec une grosse intensité", value: 5 },
    ],
  },
  {
    id: 5,
    question: "Tes objectifs quand tu joues au padel",
    options: [
      { label: "Je joue uniquement pour le loisir et le plaisir", value: 1 },
      { label: "Je joue pour progresser petit à petit", value: 2 },
      { label: "Je joue pour me challenger et gagner des matchs", value: 3 },
      { label: "Je joue pour m’améliorer et obtenir des résultats réguliers", value: 4 },
      { label: "Je joue pour performer et atteindre le plus haut niveau possible", value: 5 },
    ],
  },
  {
    id: 6,
    question: "Lecture du jeu & tactique",
    options: [
      { label: "Je joue sans vraiment réfléchir à la tactique", value: 1 },
      { label: "Je sais parfois où placer la balle", value: 2 },
      { label: "Je construis le point avec mon partenaire", value: 3 },
      { label: "Je varie mon jeu et adapte mes choix", value: 4 },
      { label: "Je lis parfaitement le jeu adverse et impose ma stratégie", value: 5 },
    ],
  },
];
