<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <aside class="ck-infobox">
            
            <xsl:if test="string(/*/@title)">
                <div class="ck-infobox__header">
                    <xsl:if test="/*/@icon and not(/*/@icon='none')">
                        <span class="ck-infobox__icon" aria-hidden="true">
                            <xsl:choose>
                                <xsl:when test="/*/@icon='warning' or (not(/*/@icon) and /*/@variant='warning')">⚠️</xsl:when>
                                <xsl:when test="/*/@icon='success' or (not(/*/@icon) and /*/@variant='success')">✅</xsl:when>
                                <xsl:when test="/*/@icon='error' or (not(/*/@icon) and /*/@variant='error')">❌</xsl:when>
                                <xsl:when test="/*/@icon='dark' or (not(/*/@icon) and /*/@variant='dark')">➕</xsl:when>
                                <xsl:when test="/*/@icon='neutral' or (not(/*/@icon) and /*/@variant='neutral')">•</xsl:when>
                                <xsl:otherwise>ℹ️</xsl:otherwise>
                            </xsl:choose>
                        </span>
                    </xsl:if>
                    <h3 class="ck-infobox__title"><xsl:value-of select="/*/@title"/></h3>
                </div>
            </xsl:if>
            
            <div class="ck-infobox__body">
                <ck-children/>
            </div>
            
        </aside>
    </xsl:template>
    
</xsl:stylesheet>
