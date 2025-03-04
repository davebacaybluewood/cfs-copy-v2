import { Skeleton } from '@mui/material'

const SubscriptionTableLoading = () => {
  return (
    <div style={{ maxWidth: 1200 }}>
      <div
        style={{
          background: 'white',
          padding: '25px',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <Skeleton
          variant='rounded'
          width={'80%'}
          height={20}
          sx={{ maxWidth: '350px' }}
        />
      </div>
      <Skeleton
        variant='rounded'
        width={'45%'}
        height={20}
        sx={{ marginTop: '5px', marginBottom: '5px', maxWidth: '220px' }}
      />
      <Skeleton
        variant='rounded'
        width={'62%'}
        height={20}
        sx={{ marginTop: '5px', marginBottom: '5px', maxWidth: '430px' }}
      />
      <div
        style={{
          background: 'white',
          marginTop: '18px',
          marginBottom: '20px',
          padding: '25px',
        }}
      >
        {Array.from({ length: 6 }).map((item, index) => (
          <div key={index}>
            <div style={{ display: 'flex', gap: '25px' }}>
              {Array.from({ length: 6 }).map((item, index) => (
                <Skeleton
                  key={index}
                  variant='rounded'
                  width={'100%'}
                  height={20}
                />
              ))}
            </div>
            <hr
              style={{
                borderTop: '1px solid #E0E0E0',
                marginTop: '20px',
                marginBottom: '20px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubscriptionTableLoading
