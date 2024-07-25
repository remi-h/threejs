type InstagramEmbedProps = {
    url: string;
    width: number;
};
const InstagramEmbed = ({ url, width }: InstagramEmbedProps) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <InstagramEmbed url={url} width={width} />
        </div>
    );
}

const igUrls = [
    'https://www.instagram.com/p/CsM_5e5NS2T/',
    'https://www.instagram.com/p/CzqoQhAIRHw/?img_index=1',
    'https://www.instagram.com/p/CRRZXENoRNk/',
    'https://www.instagram.com/p/CT4P0L8pN9l/',
    'https://www.instagram.com/p/Cm01YicBe4r/?img_index=1',
    'https://www.instagram.com/p/CtbnhJEuHwH/',
    'https://www.instagram.com/p/B_z2b4WHlwL/',
    'https://www.instagram.com/p/Cm42P33vkM4/',
    'https://www.instagram.com/p/CyN-q6JC5wj/',
    'https://www.instagram.com/p/CyRZPgiM9XE/?img_index=1',
    'https://www.instagram.com/p/CnpYgw2B9rp/',
    'https://www.instagram.com/p/CWjory-MfN4/',
    'https://www.instagram.com/p/CQxlUktHSSN/',
    'https://www.instagram.com/p/CoNkrXujdz_/',
    'https://www.instagram.com/p/CUmMKj7AuRk/',
    'https://www.instagram.com/p/CuPyzygRyjT/',
    'https://www.instagram.com/p/Cvw5nYHovhz/',
    'https://www.instagram.com/p/CwJl7CMRzKV/',
    'https://www.instagram.com/p/C6xK9LhPx8u/',
    'https://www.instagram.com/p/C6HMmnBIllA/',
    'https://www.instagram.com/p/C4xyVN8Njyg/',
    'https://www.instagram.com/p/CnvMo0NBPRV/',
    'https://www.instagram.com/p/C1HpbugCZGu/'
];

export default InstagramEmbed;
