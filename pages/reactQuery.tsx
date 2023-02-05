import styled from '@emotion/styled';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { getTestImage } from 'utils/common/study/api/unsplash';

const queryClient = new QueryClient();  

export default function ReactQuery() {
  return (
    <QueryClientProvider client={queryClient}>
      <Query />
    </QueryClientProvider>
  )
}

type UnsplashPhotos = {
  id: string;
  urls: {
    regular: string;
  }
}

function Query() {
  // access the client
  const queryClient = useQueryClient();
  // queries
  const {isLoading, error, data} = useQuery<UnsplashPhotos[]>('unsplash', getTestImage);

  if (isLoading) return <>Loading...</>
  if (error || !data) return <>Unsplash Api Error!</>;

  return (
    <main>
      <ListWrapper>
        {data.map(img => (
          <ImageWrapper key={img.id}>
            <img src={img.urls.regular} alt="" />
          </ImageWrapper>
        ))}
      </ListWrapper>
    </main>
  )
}

const ListWrapper = styled.ul`
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`
