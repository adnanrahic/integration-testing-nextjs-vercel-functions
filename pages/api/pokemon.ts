import { trace, SpanStatusCode } from '@opentelemetry/api'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export async function getTracer() {
  return await trace.getTracer('nextjs-example')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tracer = await getTracer()
  tracer.startActiveSpan('poke-api', async (span) => {
    try {
      const requestUrl = `https://pokeapi.co/api/v2/pokemon/${req.query.id || '6'}`
      const response = await fetch(requestUrl)
      const data = await response.json()

      span.setStatus({ code: SpanStatusCode.OK, message: String("Pokemon fetched successfully!") })
      span.setAttribute('pokemonName', data.name)

      res.status(200).json({
        name: data.name,
      })
  
    } catch (err) {
      res.status(500).json({ error: 'failed to load data' })
    } finally {
      span.end()
    }
  })
}
