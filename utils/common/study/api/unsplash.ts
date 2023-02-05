// Doc: https://unsplash.com/documentation#list-photos

const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESSKEY;
const secretKey = process.env.NEXT_PUBLIC_UNSPLASH_SECRETKEY;
const HOST = 'https://api.unsplash.com';

const headers = {
  'Accept-Version': 'v1',
  'Authorization': `Client-ID ${accessKey}`,
}

export function getTestImage() {
  return fetch(`${HOST}/photos`, {
    method: 'GET',
    headers
  })
  .then(res => res.json())
}
