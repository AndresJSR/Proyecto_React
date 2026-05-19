import useRegistrations from './useRegistration'

const useInscripciones = () => {
  const { registrations, loading, error, refresh } = useRegistrations()

  return {
    inscripciones: registrations,
    loading,
    error,
    refresh
  }
}

export default useInscripciones
