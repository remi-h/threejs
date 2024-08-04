// READING SPREADSHEET DATA

export type Vector = {
  url: string;
  keywords: string[];
  values: { [key: number]: number[] };
};

export const readVectors = async (): Promise<Vector[]> => {
  const spreadsheetId = process.env.NEXT_PUBLIC_SHEET_ID;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const range = 'production!A2:BEX30';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch vectors');
  }

  const data = await response.json();
  const rows = data.values;

  const getGroup = (index: number): number => {
    if (index >= 7 && index <= 306) return 1;
    if (index >= 307 && index <= 606) return 2;
    if (index >= 607 && index <= 906) return 3;
    if (index >= 907 && index <= 1206) return 4;
    if (index >= 1207 && index <= 1506) return 5;
    return -1; // Invalid group
  };

  if (rows && rows.length) {
    const vectors = rows.map((row: string[]) => {
      const url = row[0];
      const keywords = row.slice(1, 6);
      const values = row.slice(6).map(Number);
      const groupedValues: { [key: number]: number[] } = {};

      values.forEach((value, index) => {
        const group = getGroup(index + 7); // +7 because slice(6) starts from column 7
        if (group !== -1) {
          if (!groupedValues[group]) {
            groupedValues[group] = [];
          }
          groupedValues[group].push(value);
        }
      });

      return {
        url,
        keywords,
        values: groupedValues,
      };
    });
    return vectors;
  } else {
    return [];
  }
};

export default readVectors;