
export default function Loading() {

    return (
        <>
            <div className="fixed inset-0 bg-background bg-opacity-50 z-50 flex justify-center items-center">
              <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-primary" />
            </div>

            <p className='text-3xl text-text font-medium text-center my-[30vh]'>
              Processing Accounts...
            </p>
        </>
    )
}