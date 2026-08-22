import { studio } from "@/content/studio";

/**
 * Реквизиты оператора персональных данных.
 *
 * ЗАПОЛНИТЬ ДО ПУБЛИКАЦИИ. Без наименования оператора и ИНН политика
 * формально неполна по требованиям 152-ФЗ. Пока поля пустые, страница
 * подставляет название студии — этого достаточно для превью, но не для
 * боевого домена.
 */
export const legal = {
  /** Например: «ИП Рудова Наталья Владимировна» или «ООО "Атриум"» */
  operatorName: "",
  inn: "",
  /** Почтовый адрес для письменных обращений субъектов данных */
  postalAddress: "",
  /** Дата последней редакции политики */
  updated: "22 августа 2026",
};

export const operatorTitle = legal.operatorName || studio.fullName;
export const hasFullOperatorDetails = Boolean(legal.operatorName && legal.inn);
