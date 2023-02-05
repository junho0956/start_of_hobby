# React Query

- (Default) stale queries are refetched automatically in the background then:
  - New Instances of the query mount -> query instances 를 가지는 컴포넌트가 mount 될 때, refetchOnMount
  - The window is refocused -> window focus, focus 될 때 마다 포커싱, refetchOnWindowFocus
  - The network is reconnected -> automatically observering network, refetchOnReconnect
  - The query is optionally configured with a refetch interval, refetchInterval

- Query result that have no more active instances of useQuery/useInfiniteQuery/query observers are labeled as 'inactive' and remain in the cach in case that they are used again at a later time
  - By default, 'inactive' queries are garbage collected after 5min
  - => query 결과는 inactive 로 캐시에 남아있음, 다시 사용하는 경우 역시 캐시를 이용
  - 기본적으로 5분 동안 저장됨
  - To change this, you can alter the default 'cacheTime'

- Queries that fail are silently retried 3 times
  - To change this, you can alter the default 'retry' and 'retryDelay' options

- Query results by default are structurally shared to detect if data has actually changed and if not, the data reference remains unchanged to better help with value stabilization with regards to useMemo or useCallback
  - Structural sharing only works with JSON-compatible values, any other value types will always be considered as changed.
  - 쿼리 결과는 기본적으로 structural sharing 이라는 기법을 활용하는 것 같은데, 데이터의 레퍼런스를 바뀌지 않도록 유지하여 memoization 을 활용할 수 있도록 하는 것 같음
  - JSON-compatible 에 한정적으로 사용되는 것 같으며, 이외 다른 데이터 타입들은 항상 레퍼런스가 변경되었다고 판단함

- Structural sharing
  - react-query(tanStack) 에서 사용하는 코드 (immutable.js 에서도 사용한다는거)
  ```js
  // This function returns `a` if `b` is deeply equal.
  // If not, it will replace any deeply equal children of `b` with those of `a`.
  // This can be used for structural sharing between JSON values for example.
  
  // 같다는 것은 deep equal 기준
  // a와 b가 같다면 a를 리턴할거임
  // 같지 않다면 b의 자식 중 a의 자식과 같은 것은 a의 자식으로 교체될거임(a 자식의 레퍼런스를 사용한다는거겠지) 
  // JSON values 기반에서 사용
  export function replaceEqualDeep<T>(a: unknown, b: T): T
  export function replaceEqualDeep(a: any, b: any): any {
    // deep equal -> return a
    if (a === b) {
      return a
    }

    const array = isPlainArray(a) && isPlainArray(b)
    // a, b 둘다 배열이거나 a, b 둘다 객체(배열이 아닌)이면
    if (array || (isPlainObject(a) && isPlainObject(b))) {
      // a, b 의 length, iterable key 를 가져옴
      const aSize = array ? a.length : Object.keys(a).length
      const bItems = array ? b : Object.keys(b)
      const bSize = bItems.length
      // 반환될 복사본
      const copy: any = array ? [] : {}
      // 같은 값이 몆개인지를 보는 변수인듯
      let equalItems = 0
      // 레퍼런스는 a를 기준으로 보기 때문에 b를 순회하는 것
      for (let i = 0; i < bSize; i++) {
        // 배열인지 객체인지에 따라 index 혹은 key를 가져옴
        const key = array ? i : bItems[i]
        // 재귀
        copy[key] = replaceEqualDeep(a[key], b[key])
        // 재귀의 결과가 a[key]와 같다면 a[key]가 반환되었다는 것이고 이는 같은 레퍼런스를 가진다는 의미
        if (copy[key] === a[key]) {
          equalItems++
        }
      }
      // 값의 길이가 같고, 동일한 레퍼런스 수가 a의 수와 같다는 것은 레퍼런스 자체가 a인 것
      // 다르다면 결국 b로부터 새로운 레퍼런스를 가져왔다는 의미가 됨
      return aSize === bSize && equalItems === aSize ? a : copy
    }

    return b
  }

  // ** structural sharing 을 사용한다면 '실제로' 값이 바뀌었을 때만 레퍼런스가 바뀐다는 의미이니,
  // 이는 곧 memoization 을 위한 코드라고 생각함
  ```

- Query Basic
  - query 는 서버로부터 데이터를 받는 Promise based method 는 모두 사용할 수 있음
  - if your method modifies data on the server, we recommend using 'Mutations' instead
    - 서버에 데이터를 바꾸는 메소드를 사용한다면 (Post, Put, ..) Mutations 를 사용하는걸 추천
  - `const result = useQuery(unique key, any fetch function)`
    - result 에는 여러 프로퍼티가 존재하는데, 이 중 가장 눈에 띄었던 것은 `isLoading` 와 `isFetching`
      - `isLoading` or `status === 'loading` - The query has no data and is currently fetching
      - `isFetching` - In any state, if the query is fetching at any time(including background refetching) `isFetching` will be `true`
      - 똑같아 보여서 뭐가 다른지 고민해봤는데 문장에서 친절히 알려주고 있더라!
        - `isLoading` => The query has no data and is currently fetching
        - isLoading 은 데이터가 없고 당장 패칭중일 때
        - `isFetching` => fetching at any time
        - fetching 하는 시점
        - 결국 isLoading 은 **최초** fetch 단계를, isFetching 은 fetching 단계를
        - default options 으로 refetchOnWindowFocus 를 이용해서 콘솔을 확인해봤는데 확실히 isLoading 은 mount 될때만 true를 반환하고 그 이후부터는 false를, isFetching 은 시점에 맞는 boolean 값을 반환함

